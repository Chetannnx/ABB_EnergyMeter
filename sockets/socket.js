module.exports = function(io){

  io.on("connection", socket => {

    console.log("🌐 Connected");

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

  });

};
