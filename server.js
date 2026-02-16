  const express = require("express");
  const http = require("http");
  const socketIO = require("socket.io");
  const path = require("path");
  const cors = require ("cors")

  const mongo = require("./services/mongo.service"); // ✅ ADD THIS

  const poll = require("./services/poll.service");
  const dataRoutes = require("./routes/data.routes");
  const socketHandler = require("./sockets/socket");

  const app = express();
  const server = http.createServer(app);
  // const io = socketIO(server);

  const io = socketIO(server, {
  cors: {
    origin: "http://192.168.1.96:3000",
    credentials: true,
  },
});

  app.use(
    cors({
      origin: "http://192.168.1.96:3000",
      credentials: true,
    })
  )
  app.use(express.static("public"));

  app.use("/api/data", dataRoutes);
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "test.html"));
  });


  socketHandler(io);

  setInterval(() => {
    poll(io).catch(console.log);
  }, 2000);

  // server.listen(3000, () => {
  //   console.log(`👉 http://localhost:3000`);
  // });

  server.listen(3000, "0.0.0.0", () => {
  console.log(`👉 Server running on port 3000`);
});

