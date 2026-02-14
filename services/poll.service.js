const modbus = require("./modbus.service");
const mongo = require("./mongo.service");
const mapValues = require("../utils/mapper");
const config = require("../config/modbus"); 

// Register blocks
const BLOCKS = [
  { start: 4095, count: 66 },
  { start: 4165, count: 26 },
  { start: 4191, count: 10 },
  { start: 4207, count: 44 },
  { start: 4261, count: 32 },
  { start: 4511, count: 4 },
];

// Save interval (2 minutes)
const SAVE_INTERVAL = 120000;

let lastSaveTime = 0;

/**
 * Poll meter, save data, and emit live values
 */
async function poll(io) {

  try {

    // Ensure connections
    await modbus.connect();
    await mongo.connect();

    const rawData = {};

    // Read all blocks
    for (const block of BLOCKS) {

      rawData[block.start] =
        await modbus.readChunks(
          block.start,
          block.count
        );
    }

    // Map registers to values
    const Data = mapValues(rawData);

    const now = Date.now();

    // Format DB object
    const mongoData = {
      DeviceName: config.device.name,
      timestamp: new Date(),
      Data
    };

    // Save periodically
    if (now - lastSaveTime >= SAVE_INTERVAL) {

      await mongo.save(mongoData);

      lastSaveTime = now;

      console.log("💾 Data saved to MongoDB");
    }

    // Send live data
    io.emit("meterData", {
      ...Data,
      time: new Date().toLocaleString()
    });

    console.log("📡 Live Data Updated");
    console.log("Time",Date())

  } catch (error) {

    console.error("⚠️ Polling Error:", error.message);

    // Optional: close modbus on failure
    try {
      await modbus.close?.();
    } catch {}
  }
}

module.exports = poll;
