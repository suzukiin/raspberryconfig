var mqtt = require('mqtt')

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
    console.log(error);
});

client.on('message', function (topic, message) {
    // called each time a message is received
    console.log('Received message:', topic, message.toString());
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
    console.log(`Temperatura enviada: ${temperatura}°C`);
}

// Enviar temperatura a cada 10 segundos após conectar
client.on('connect', function () {
    console.log('Connected');
    
    // Enviar primeira temperatura imediatamente
    enviarTemperatura();
    
    // Configurar envio automático a cada 10 segundos
    setInterval(enviarTemperatura, 10000);
});