var snmp = require('net-snmp');
var session = snmp.createSession("192.168.100.16", "public");
const express = require('express');
const app = express();
const path = require('path');
var mqtt = require('mqtt')

// Dados globais para armazenar informações SNMP e MQTT
let deviceData = {
    model: 'Carregando...',
    snmpStatus: 'Conectando...',
    mqttStatus: 'Conectando...',
    temperature: null,
    lastUpdate: new Date(),
    snmpError: null,
    mqttError: null
};

var OID = '1.3.6.1.4.1.25026.13.1.1.1.0';

// Função para buscar dados SNMP
function fetchSNMPData() {
    session.get([OID], function (error, varbinds) {
        if (error) {
            console.error('Error fetching SNMP data:', error);
            deviceData.snmpStatus = 'Erro';
            deviceData.snmpError = error.message;
        } else {
            var model = varbinds[0].value.toString();
            console.log('Model:', model);
            deviceData.model = model;
            deviceData.snmpStatus = 'Conectado';
            deviceData.snmpError = null;
            deviceData.lastUpdate = new Date();
        }
    });
}

var options = {
    host: 'a30981839f9a4329ad19a5a648e7495e.s2.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'raspberry',
    password: 'Raspberry123',
}

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on('error', function (error) {
    console.log('MQTT Error:', error);
    deviceData.mqttStatus = 'Erro';
    deviceData.mqttError = error.message;
});

client.on('message', function (topic, message) {
    // called each time a message is received
    console.log('Received message:', topic, message.toString());
    try {
        const data = JSON.parse(message.toString());
        deviceData.temperature = data.temperatura;
        deviceData.lastUpdate = new Date();
    } catch (e) {
        console.log('Erro ao processar mensagem MQTT:', e);
    }
});

// subscribe to topic 'temperatura/raspberry'
client.subscribe('temperatura/raspberry');

// Função para gerar temperatura aleatória entre 20 e 30 graus
function gerarTemperatura() {
    return (Math.random() * 10 + 20).toFixed(1);
}

// Função para enviar temperatura
function enviarTemperatura() {
    const temperatura = gerarTemperatura();
    const payload = JSON.stringify({
        temperatura: parseFloat(temperatura),
        timestamp: new Date().toISOString(),
        unidade: '°C'
    });
    
    client.publish('temperatura/raspberry', payload);
}

// Enviar temperatura a cada 10 segundos após conectar
client.on('connect', function () {
    console.log('MQTT Connected');
    deviceData.mqttStatus = 'Conectado';
    deviceData.mqttError = null;
    
    // Enviar primeira temperatura imediatamente
    enviarTemperatura();
    
    // Configurar envio automático a cada 10 segundos
    setInterval(enviarTemperatura, 10000);
});

app.use(express.static(path.join(__dirname, 'public')));

// Rota para página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para fornecer dados do dispositivo
app.get('/api/device-data', (req, res) => {
    res.json(deviceData);
});

// Buscar dados SNMP iniciais e repetir a cada 30 segundos
fetchSNMPData();
setInterval(fetchSNMPData, 30000);

app.listen(3000, () => {
    console.log('🌡️  Servidor rodando em http://localhost:3000');
    console.log('📊 Dashboard integrado SNMP + MQTT iniciado');
    console.log('🔄 Dados SNMP: 192.168.100.18');
    console.log('📡 MQTT: HiveMQ Cloud');
});