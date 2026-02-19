// const modbus = require("./modbus.service");
// const mongo = require("./mongo.service");
// const mapValues = require("../utils/mapper");
// const config = require("../config/modbus"); 

// // Register blocks
// const BLOCKS = [
//   { start: 4095, count: 66 },
//   { start: 4165, count: 26 },
//   { start: 4191, count: 10 },
//   { start: 4207, count: 44 },
//   { start: 4261, count: 32 },
//   { start: 4511, count: 4 },
// ];

// // Save interval (2 minutes)
// const SAVE_INTERVAL = 120000;

// let lastSaveTime = 0;

// /**
//  * Poll meter, save data, and emit live values
//  */
// async function poll(io) {

//   try {

//     // Ensure connections
//     await modbus.connect();
//     await mongo.connect();

//     const rawData = {};

//     // Read all blocks
//     for (const block of BLOCKS) {

//       rawData[block.start] =
//         await modbus.readChunks(
//           block.start,
//           block.count
//         );
//     }

//     // Map registers to values
//     const Data = mapValues(rawData);

//     const now = Date.now();

//     // Format DB object
//     const mongoData = {
//       DeviceName: config.device.name,
//       timestamp: new Date(),
//       Data
//     };

//     // Save periodically
//     if (now - lastSaveTime >= SAVE_INTERVAL) {

//       await mongo.save(mongoData);

//       lastSaveTime = now;

//       console.log("💾 Data saved to MongoDB");
//     }

//     // Send live data
//     io.emit("meterData", {
//       ...Data,
//       time: new Date().toLocaleString()
//     });

//     console.log("📡 Live Data Updated");
//     console.log("Time",Date())

//   } catch (error) {

//     console.error("⚠️ Polling Error:", error.message);

//     // Optional: close modbus on failure
//     try {
//       await modbus.close?.();
//     } catch {}
//   }
// }

// module.exports = poll;



// const modbus = require("./modbus.service");
// const mongo = require("./mongo.service");
// const mapValues = require("../utils/mapper");
// const config = require("../config/modbus");

// // Register blocks
// const BLOCKS = [
//   { start: 4095, count: 66 },
//   { start: 4165, count: 26 },
//   { start: 4191, count: 10 },
//   { start: 4207, count: 44 },
//   { start: 4261, count: 32 },
//   { start: 4511, count: 4 },
// ];

// const SAVE_INTERVAL = 120000;
// let lastSaveTime = 0;

// async function poll(io) {

//   try {

//     await mongo.connect();

//     // 🔥 LOOP THROUGH ALL METERS
//     for (const device of config.device) {

//       const client = await modbus.connect(device);

//       const rawData = {};

//       // Read all blocks
//       for (const block of BLOCKS) {

//         rawData[block.start] =
//           await modbus.readChunks(
//             client,
//             block.start,
//             block.count
//           );
//       }

//       const Data = mapValues(rawData);

//       const now = Date.now();

//       const mongoData = {
//         DeviceName: device.name,
//         ip: device.ip,
//         timestamp: new Date(),
//         Data
//       };

//       if (now - lastSaveTime >= SAVE_INTERVAL) {

//         await mongo.save(mongoData);

//         console.log(`💾 Data saved → ${device.name}`);
//         lastSaveTime = now;
//       }

//       // Send live data with device name
//       io.emit("meterData", {
//         device: device.name,
//         ...Data,
//         time: new Date().toLocaleString()
//       });

//       console.log(`📡 Live Data Updated → ${device.name}`);

//       // ✅ Close connection
//       await client.close();
//     }

    

//   } catch (error) {

//     console.error("⚠️ Polling Error:", error.message);
//   }
// }

// module.exports = poll;



//==============multi meter and device store seperate DB===============//

const modbus = require("./modbus.service");
const mongo = require("./mongo.service");
const mapValues = require("../utils/mapper");
const config = require("../config/modbus");

const BLOCKS = [
  { start: 4095, count: 66 },
  { start: 4165, count: 26 },
  { start: 4191, count: 10 },
  { start: 4207, count: 44 },
  { start: 4261, count: 32 },
  { start: 4511, count: 4 },
];

const SAVE_INTERVAL = 120000; // 2 minutes
let lastSaveTime = 0;

async function poll(io) {

  try {

    await mongo.connect();

    // register devices (insert/update)
    await mongo.syncDevices(config.device);

    const now = Date.now();

    // ✅ decide once per cycle
    let shouldSave = false;

    if (now - lastSaveTime >= SAVE_INTERVAL) {
      shouldSave = true;
      lastSaveTime = now;
    }

    // 🔥 LOOP ALL METERS
    for (const device of config.device) {

      try {

        const client = await modbus.connect(device);

        const rawData = {};

        // read modbus blocks
        for (const block of BLOCKS) {
          rawData[block.start] =
            await modbus.readChunks(
              client,
              block.start,
              block.count
            );
        }

        const Data = mapValues(rawData);

        // ===============================
        // ✅ VOLTAGE AVERAGE
        // ===============================
        if (
          Data.PHASE_VOLTAGE_L1_N != null &&
          Data.PHASE_VOLTAGE_L2_N != null &&
          Data.PHASE_VOLTAGE_L3_N != null
        ) {
          Data.VOLTAGE_AVG = Number(
            (
              (Data.PHASE_VOLTAGE_L1_N +
                Data.PHASE_VOLTAGE_L2_N +
                Data.PHASE_VOLTAGE_L3_N) / 3
            ).toFixed(2)
          );
        } else {
          Data.VOLTAGE_AVG = 0;
        }

        // ===============================
        // ✅ CURRENT AVERAGE
        // ===============================
        if (
          Data.LINE_CURRENT_L1 != null &&
          Data.LINE_CURRENT_L2 != null &&
          Data.LINE_CURRENT_L3 != null
        ) {
          Data.CURRENT_AVG = Number(
            (
              (Data.LINE_CURRENT_L1 +
                Data.LINE_CURRENT_L2 +
                Data.LINE_CURRENT_L3) / 3
            ).toFixed(2)
          );
        } else {
          Data.CURRENT_AVG = 0;
        }

        // ===============================
        // ✅ POWER FACTOR AVERAGE
        // ===============================
        if (
          Data.POWER_FACTOR_L1 != null &&
          Data.POWER_FACTOR_L2 != null &&
          Data.POWER_FACTOR_L3 != null
        ) {
          Data.POWER_AVG = Number(
            (
              (Data.POWER_FACTOR_L1 +
                Data.POWER_FACTOR_L2 +
                Data.POWER_FACTOR_L3) / 3
            ).toFixed(2)
          );
        } else {
          Data.POWER_AVG = 0;
        }

        // find device from DB
        const dbDevice = await mongo.getDeviceByIP(device.ip);

        if (!dbDevice) {
          console.log("❌ Device not found:", device.ip);
          await client.close();
          continue;
        }

        // ✅ Save every 2 minutes
        if (shouldSave) {

          const mongoData = {
            deviceId: dbDevice._id,
            timestamp: new Date(),
            Data
          };

          await mongo.save(mongoData);

          console.log(`💾 Data saved → ${device.name}`);
        }

        // live socket emit
        io.emit("meterData", {
          device: device.name,
          ...Data,
          time: new Date().toLocaleString()
        });

        console.log(`📡 Live Data Updated → ${device.name}`);

        await client.close();

      } catch (err) {

        console.log(`❌ Meter Failed: ${device.name} → ${err.message}`);

        // continue next meter
        continue;
      }
    }

  } catch (error) {

    console.error("⚠️ Polling System Error:", error.message);
  }
}

module.exports = poll;


