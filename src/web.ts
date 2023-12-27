export * from './sdk';
// export * from './sdk/init';

// for mobile
if (typeof BigInt === "undefined") {
  global.BigInt = require("big-integer");
}
