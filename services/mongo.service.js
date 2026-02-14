const { MongoClient } = require("mongodb");
const config = require("../config/db");

let collection;

async function connect() {

  if (collection) return collection;

  const client = new MongoClient(config.url);

  await client.connect();

  const db = client.db(config.name);

  collection = db.collection(config.collection);

  await collection.createIndex({ timestamp: 1 });

  console.log("✅ Mongo Connected");

  return collection;
}

async function save(data) {
  if (!collection) return;
  await collection.insertOne(data);
}

module.exports = {
  connect,
  save,
  getCollection: () => collection
};
