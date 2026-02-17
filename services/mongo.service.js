// const { MongoClient } = require("mongodb");
// const config = require("../config/db");

// let collection;

// async function connect() {

//   if (collection) return collection;

//   const client = new MongoClient(config.url);

//   await client.connect();

//   const db = client.db(config.name);

//   collection = db.collection(config.collection);

//   await collection.createIndex({ timestamp: 1 });

//   console.log("✅ Mongo Connected");

//   return collection;
// }

// async function save(data) {
//   if (!collection) return;
//   await collection.insertOne(data);
// }

// module.exports = {
//   connect,
//   save,
//   getCollection: () => collection
// };


// const { MongoClient } = require("mongodb");
// const config = require("../config/db");

// let client;
// let collection;

// async function connect() {

//   if (collection) return collection;

//   client = new MongoClient(config.url);

//   await client.connect();

//   const db = client.db(config.name);

//   collection = db.collection(config.collection);

//   // Index for faster queries
//   await collection.createIndex({ DeviceName: 1, timestamp: 1 });

//   console.log("✅ Mongo Connected");

//   return collection;
// }

// async function save(data) {

//   if (!collection) {
//     await connect();
//   }

//   await collection.insertOne(data);
// }

// module.exports = {
//   connect,
//   save,
//   getCollection: () => collection
// };


const { MongoClient } = require("mongodb");
const config = require("../config/db");

let client;
let collection;
let devicesCollection;

async function connect() {

  if (collection) return collection;

  client = new MongoClient(config.url);

  await client.connect();

  const db = client.db(config.name);

  // meter data collection
  collection = db.collection(config.collection);

  // devices collection
  devicesCollection = db.collection("devices");

  // Index for faster queries
  await collection.createIndex({ deviceId: 1, timestamp: 1 });

  // Unique IP for devices
  await devicesCollection.createIndex({ ip: 1 }, { unique: true });

  console.log("✅ Mongo Connected");

  return collection;
}

async function save(data) {

  if (!collection) {
    await connect();
  }

  await collection.insertOne(data);
}

// 🔥 Get device by IP
async function getDeviceByIP(ip) {

  if (!devicesCollection) await connect();

  return await devicesCollection.findOne({ ip });
}

// 🔥 Auto register devices
// async function syncDevices(devices) {

//   if (!devicesCollection) await connect();

//   for (const device of devices) {

//     const exists = await devicesCollection.findOne({
//       ip: device.ip,
//       unitId: device.unitId
//     });

//     if (!exists) {

//       await devicesCollection.insertOne({
//         name: device.name,
//         ip: device.ip,
//         port: device.port || 502,
//         unitId: device.unitId || 1,
//         location: device.location || "",
//         createdAt: new Date()
//       });

//       console.log("✅ Device added:", device.name);
//     }
//   }
// }


async function syncDevices(devices) {

  if (!devicesCollection) await connect();

  for (const device of devices) {

    const exists = await devicesCollection.findOne({
      ip: device.ip,
      unitId: device.unitId
    });

    if (exists) {

      // ✅ UPDATE existing device (keep same _id)
      await devicesCollection.updateOne(
        { _id: exists._id },
        {
          $set: {
            name: device.name,
            port: device.port || 502,
            unitId: device.unitId || 1
            // location: device.location || ""
          }
        }
      );

      console.log("🔄 Device updated:", device.name);

    } else {

      // ✅ INSERT new device
      await devicesCollection.insertOne({
        name: device.name,
        ip: device.ip,
        port: device.port || 502,
        unitId: device.unitId || 1,
        // location: device.location || "",
        createdAt: new Date()
      });

      console.log("✅ Device added:", device.name);
    }
  }
}

module.exports = {
  connect,
  save,
  getCollection: () => collection,
  getDeviceByIP,
  syncDevices
};
