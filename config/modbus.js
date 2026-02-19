// module.exports = {
//   port: 502,
//   device: {
//     name: "Meter-1",
//     ip: "192.168.1.201",
//     unitId: 1
//   },
  
//   pollInterval: 2000
// };


module.exports = {
  port: 502,

  device: [
    {
      name: "ABB M4M 30 ENERGY METER-1",
      ip: "192.168.1.201",
      unitId: 1
    },
    // {
    //   name: "ABB M4M 30 ENERGY METER-2",
    //   ip: "192.168.1.202",
    //   unitId: 1
    // },
    // {
    //   name: "ABB M4M 30 ENERGY METER-3",
    //   ip: "192.168.1.203",
    //   unitId: 1
    // }
  ],

  pollInterval: 5000
};
