// function toUInt32Scaled(high, low) {
//   const raw = ((high << 16) >>> 0) + low;
//   return raw / 65536;
// }


// function toUInt32Scaled(high, low, scale = 65536) {

//   const hi = high & 0xFFFF;
//   const lo = low & 0xFFFF;

//   const raw = (hi * 0x10000) + lo;

//   return raw / scale;
// }

function toUInt32Scaled(low, high, divider = 1) {

  const lo = low & 0xFFFF;
  const hi = high & 0xFFFF;

  const raw = (hi << 16) + lo;

  return raw / divider;
}







// function toInt32(high, low, scale = 65536) {
//   const val = (high << 16) | low;
//   return (val >> 0) / scale;
// }


// function toInt32(low, high, scale = 1) {

//   const hi = high & 0xFFFF;
//   const lo = low & 0xFFFF;

//   // Swap words here
//   let raw = (hi << 16) >>> 0 | lo;

//   // Convert to signed
//   if (raw & 0x80000000) {
//     raw -= 0x100000000;
//   }

//   return raw / scale;
// }

//============  16BIT ==================
// function toInt32(value, scale = 1) {

//   let raw = value & 0xFFFF;

//   if (raw & 0x8000) {
//     raw = raw - 0x10000;
//   }

//   return raw / scale;
// }


//==============  32BIT   ========================
function toInt32(high, low, scale = 1) {

  // Convert possible signed 16-bit to unsigned
  const hi = high & 0xFFFF;
  const lo = low & 0xFFFF;

  const buffer = Buffer.alloc(4);

  buffer.writeUInt16BE(hi, 2); // 0
  buffer.writeUInt16BE(lo, 0); // 2

  const raw = buffer.readInt32BE(0);

  return raw / scale;
}




module.exports = {
  toUInt32Scaled,
  toInt32
};
