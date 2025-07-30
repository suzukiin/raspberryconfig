const snmp = require('net-snmp');
var session = snmp.createSession("192.168.100.16", "public");

var exciter = {
    systemModel: "1.3.6.1.4.1.25026.13.1.1.1.0",
    systemChannel: "1.3.6.1.4.1.25026.13.1.1.2.0",
    systemProgrammedPower: "1.3.6.1.4.1.25026.13.1.1.10.0",
    systemForwardPower: "1.3.6.1.4.1.25026.13.1.1.11.0",
    systemReflectedPower: "1.3.6.1.4.1.25026.13.1.1.12.0",
    exciterPowerSupply3V: "1.3.6.1.4.1.25026.13.1.1.15.0",
    exciterPowerSupply5V: "1.3.6.1.4.1.25026.13.1.1.16.0",
    exciterPowerSupply15V: "1.3.6.1.4.1.25026.13.1.1.17.0",
    exciterPowerSupply28V: "1.3.6.1.4.1.25026.13.1.1.18.0",
    exciterPowerSupply8V: "1.3.6.1.4.1.25026.13.1.1.19.0",
    exciterPowerSupply15V: "1.3.6.1.4.1.25026.13.1.1.20.0",
}

const identifierOID = Object.keys(exciter);
let oid = Object.values(exciter);
let resultado = [];

session.get(oid, function (error, varbinds) {
    if (error) {
        console.log(error);
    } else {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError(varbinds[i])) {
                console.log(snmp.varbindError(varbinds[i]));
            } else {
                resultado.push(varbinds[i].value)
            }
        }
        for (let index = 0; index < identifierOID.length; index++) {
            let value = resultado[index];
            if (identifierOID[index].includes('exciterPowerSupply')) {
                value = (resultado[index] == 1) ? 'OK' : 'FAIL';
            }

            console.log(`${identifierOID[index]}: ${value}`);
        }
    }
    session.close();
})

