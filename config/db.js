module.exports = {
  url: "mongodb://chetan:chetan123@192.168.1.96:27021/chetanDB?authSource=admin",
  name: "chetanDB",
  collection: "collection1",         //Meter Data
  deviceCollection: "devices",      // device info

  saveInterval: 120000
};
