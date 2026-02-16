const router = require("express").Router();
const mongo = require("../services/mongo.service");



// ================= DAILY =================
router.get("/daily", async (req, res) => {
  try {

    const col = mongo.getCollection();
    if (!col) return res.status(500).json({ error: "DB Not Ready" });

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date required (YYYY-MM-DD)" });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const data = await col.find({
      timestamp: { $gte: start, $lte: end }
    }).sort({ timestamp: 1 }).toArray();

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= MONTHLY =================
router.get("/monthly", async (req, res) => {
  try {

    const col = mongo.getCollection();
    if (!col) return res.status(500).json({ error: "DB Not Ready" });

    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and Month required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const data = await col.find({
      timestamp: { $gte: start, $lte: end }
    }).sort({ timestamp: 1 }).toArray();

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= YEARLY =================
router.get("/yearly", async (req, res) => {
  try {

    const col = mongo.getCollection();
    if (!col) return res.status(500).json({ error: "DB Not Ready" });

    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ error: "Year required" });
    }

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const data = await col.find({
      timestamp: { $gte: start, $lte: end }
    }).sort({ timestamp: 1 }).toArray();

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Latest meter data (for Postman)
// ================= LATEST =================
router.get("/latest", async (req, res) => {

  try {

    const col = mongo.getCollection();
    if (!col) return res.status(500).json({ error: "DB Not Ready" });

    const data = await col   // ✅ USE col
      .find()
      .sort({ timestamp: -1 }) // newest first
      .limit(1)
      .toArray();

    if (!data.length) {
      return res.json({ message: "No data found" });
    }

    res.json(data[0]);

  } catch (err) {

    console.error("Latest API Error:", err);
    res.status(500).json({ error: "Server error" });

  }
});


module.exports = router;
