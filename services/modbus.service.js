const ModbusRTU = require("modbus-serial");
const config = require("../config/modbus");

// let client;

// async function connect() {

//   if (client?.isOpen) return client;

//   client = new ModbusRTU();

//   await client.connectTCP(config.device.ip, {
//     port: config.port
//   });

//   client.setID(config.device.unitId);
//   client.setTimeout(3000);

//   console.log("✅ Modbus Connected");

//   return client;
// }

async function connect(device) {

  const client = new ModbusRTU();

  await client.connectTCP(device.ip, {
    port: config.port
  });

  client.setID(device.unitId);
  client.setTimeout(3000);

  console.log(`✅ Modbus Connected -> ${device.name}`);

  return client;
}

async function readChunks(client, start, count, chunk = 20) {

  const result = [];

  for (let i = 0; i < count; i += chunk) {

    const size = Math.min(chunk, count - i);

    const res = await client.readHoldingRegisters(
      start + i,
      size
    );

    result.push(...res.data);
  }

  return result;
}

module.exports = {
  connect,
  readChunks
};
