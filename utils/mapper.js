const { toUInt32Scaled, toInt32 } = require("./converters");

function mapValues(raw) {

  const b1 = raw[4095];
  const b2 = raw[4165];
  const b3 = raw[4191];
  const b4 = raw[4207];
  const b5 = raw[4261];
  const b6 = raw[4511];

  return {

     // BLOCK 1
    // reg44096: b1[0],
    PHASE3_SYSTEM_VOLTAGE: toUInt32Scaled(b1[0]),
    PHASE_VOLTAGE_L1_N: toUInt32Scaled(b1[2],b1[3]),
    PHASE_VOLTAGE_L2_N: toUInt32Scaled(b1[4],b1[5]),
    PHASE_VOLTAGE_L3_N: toUInt32Scaled(b1[6],b1[7]),
    LINE_VOLTAGE_L1_2: toUInt32Scaled(b1[8],b1[9]),
    LINE_VOLTAGE_L2_3: toUInt32Scaled(b1[10],b1[11]),
    LINE_VOLTAGE_L3_1: toUInt32Scaled(b1[12],b1[13]),
    PHASE3_SYSTEM_CURRENT: toUInt32Scaled(b1[14],b1[15]),
    LINE_CURRENT_L1: toUInt32Scaled(b1[16],b1[17]),
    LINE_CURRENT_L2: toUInt32Scaled(b1[18],b1[19]),
    LINE_CURRENT_L3: toUInt32Scaled(b1[20],b1[21]),
    PHASE3_SYS_POWER_FACTOR: toInt32(b1[22],b1[23], 1000),
    POWER_FACTOR_L1: toInt32(b1[24],b1[25], 1000),
    POWER_FACTOR_L2: toInt32(b1[26],b1[27], 1000),
    POWER_FACTOR_L3: toInt32(b1[28],b1[29], 1000),
    PHASE3_SYSTEM_COSϕ: toInt32(b1[30],b1[31], 1000),
    PHASE_COS_ϕ1: toInt32(b1[32],b1[33], 1000),
    PHASE_COS_ϕ2: toInt32(b1[34],b1[35], 1000),
    PHASE_COS_ϕ3: toInt32(b1[36],b1[37], 1000),
    PHASE3_S_APPARENT_POWER: toUInt32Scaled(b1[38],b1[39]),
    APPARENT_POWER_L1: toUInt32Scaled(b1[40],b1[41]),
    APPARENT_POWER_L2: toUInt32Scaled(b1[42],b1[43]),
    APPARENT_POWER_L3: toUInt32Scaled(b1[44],b1[45]),
    PHASE3_S_ACTIVE_POWER: toInt32(b1[46],b1[47]),
    ACTIVE_POWER_L1: toInt32(b1[48],b1[49]),
    ACTIVE_POWER_L2: toInt32(b1[50],b1[51]),
    ACTIVE_POWER_L3: toInt32(b1[52],b1[53]),
    PHASE3_S_REACTIVE_POWER: toInt32(b1[54],b1[55]),
    REACTIVE_POWER_L1: toInt32(b1[56],b1[57]),
    REACTIVE_POWER_L2: toInt32(b1[58],b1[59]),
    REACTIVE_POWER_L3: toInt32(b1[60],b1[61]),
    PHASE3_SYS_ACTIVE_ENERGY: toUInt32Scaled(b1[62],b1[63]),
    PHASE3_SYS_REACTIVE_ENERGY: toUInt32Scaled(b1[64],b1[65]),

    // BLOCK 2
    FREQUENCY: toUInt32Scaled(b2[0],b2[1]),

    // BLOCK 3
    MAX_LINE_CURRENT_L1: toUInt32Scaled(b3[0],b3[1]),
    MAX_LINE_CURRENT_L2: toUInt32Scaled(b3[2],b3[3]),
    MAX_LINE_CURRENT_L3: toUInt32Scaled(b3[4],b3[5]),
    MAX_3PHASE_SYS_ACTIVE_POWER: toInt32(b3[6],b3[7]),
    MAX_3PHASE_SYS_APPARENT_POWER: toUInt32Scaled(b3[8],b3[9]),

    //BLOCK 4
    PHASE3_SYS_ACTIVE_POWER_15_AVER: toInt32(b4[0],b4[1]),
    PHASE3_SYS_APPARENT_POWER_15_AVER: toUInt32Scaled(b4[2],b4[3]),
    ACTIVE_ENERGY_L1: toUInt32Scaled(b4[4],b4[5]),
    ACTIVE_ENERGY_L2: toUInt32Scaled(b4[6],b4[7]),
    ACTIVE_ENERGY_L3: toUInt32Scaled(b4[8],b4[9]),
    REACTIVE_ENERGY_L1: toUInt32Scaled(b4[10],b4[11]),
    REACTIVE_ENERGY_L2: toUInt32Scaled(b4[12],b4[13]),
    REACTIVE_ENERGY_L3: toUInt32Scaled(b4[14],b4[15]),
    MAX_3PHASE_SYS_ACTIVE_POWER_15_AVER: toInt32(b4[16],b4[17]),
    VOLTAGE_THD_L1: toUInt32Scaled(b4[18],b4[19]),
    VOLTAGE_THD_L2: toUInt32Scaled(b4[20],b4[21]),
    VOLTAGE_THD_L3: toUInt32Scaled(b4[22],b4[23]),
    CURRENT_THD_L1: toUInt32Scaled(b4[24],b4[25]),
    CURRENT_THD_L2: toUInt32Scaled(b4[26],b4[27]),
    CURRENT_THD_L3: toUInt32Scaled(b4[28],b4[29]),
    MAX_ACTIVE_POWER_15_AVER_L1: toInt32(b4[30],b4[31]),
    MAX_ACTIVE_POWER_15_AVER_L2: toInt32(b4[32],b4[33]),
    MAX_ACTIVE_POWER_15_AVER_L3: toInt32(b4[34],b4[35]),
    MAX_3PHASE_SYS_APPARENT_POWER_15_AVER: toUInt32Scaled(b4[36],b4[37]),
    MAX_APPARERENT_POWER_15_AVER_L1: toUInt32Scaled(b4[38],b4[39]),
    MAX_APPARERENT_POWER_15_AVER_L2: toUInt32Scaled(b4[40],b4[41]),
    MAX_APPARERENT_POWER_15_AVER_L3: toUInt32Scaled(b4[42],b4[43]),


    //BLOCK 5
    PHASE3_SYS_APPARENT_ENERGY: toUInt32Scaled(b5[0],b5[1]),
    APPARENT_ENERGY_L1: toUInt32Scaled(b5[2],b5[3]),
    APPARENT_ENERGY_L2: toUInt32Scaled(b5[4],b5[5]),
    APPARENT_ENERGY_L3: toUInt32Scaled(b5[6],b5[7]),
    PHASE3_SYS_GENERATED_ACTIVE_ENERGY : toUInt32Scaled(b5[8],b5[9]),
    GENERATED_ACTIVE_ENERGY_L1: toUInt32Scaled(b5[10],b5[11]),
    GENERATED_ACTIVE_ENERGY_L2: toUInt32Scaled(b5[12],b5[13]),
    GENERATED_ACTIVE_ENERGY_L3: toUInt32Scaled(b5[14],b5[15]),
    PHASE3_SYS_GENERATED_REACTIVE_ENERGY: toUInt32Scaled(b5[16],b5[17]),
    GENERATED_REACTIVE_ENERGY_L1: toUInt32Scaled(b5[18],b5[19]),
    GENERATED_REACTIVE_ENERGY_L2: toUInt32Scaled(b5[20],b5[21]),
    GENERATED_REACTIVE_ENERGY_L3: toUInt32Scaled(b5[22],b5[23]),
    PHASE3_SYS_GENERATED_APPARENT_ENERGY: toUInt32Scaled(b5[24],b5[25]),
    GENERATED_APPARENT_ENERGY_L1: toUInt32Scaled(b5[26],b5[27]),
    GENERATED_APPARENT_ENERGY_L2: toUInt32Scaled(b5[28],b5[29]),
    GENERATED_APPARENT_ENERGY_L3: toUInt32Scaled(b5[30],b5[31]),


    //BLOCK 6
    CURRENT_TRANSFORMER_PRIMARY_CT: toUInt32Scaled(b6[0],b6[1]),
    VOLTAGE_TRANSFORMER_PRIMARY_VT: toUInt32Scaled(b6[2],b6[3]),
  };
}

module.exports = mapValues;
