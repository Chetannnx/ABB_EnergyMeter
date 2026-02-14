// function toUInt32Scaled(high, low) {
//   const raw = ((high << 16) >>> 0) + low;
//   return raw / 65536;
// }


function toUInt32Scaled(high, low, scale = 65536) {

  const hi = high & 0xFFFF;
  const lo = low & 0xFFFF;

  const raw = (hi * 0x10000) + lo;

  return raw / scale;
}



// function toInt32(high, low, scale = 65536) {
//   const val = (high << 16) | low;
//   return (val >> 0) / scale;
// }


function toInt32(low, high, scale = 1) {

  const hi = high & 0xFFFF;
  const lo = low & 0xFFFF;

  // Swap words here
  let raw = (hi << 16) >>> 0 | lo;

  // Convert to signed
  if (raw & 0x80000000) {
    raw -= 0x100000000;
  }

  return raw / scale;
}



module.exports = {
  toUInt32Scaled,
  toInt32
};
