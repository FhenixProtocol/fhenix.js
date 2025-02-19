// for mobile
// if (typeof BigInt === "undefined") {
//   global.BigInt = require("big-integer");
// }
export { FhenixClient, FhenixClientSync } from "./sdk/index.js";
export { EncryptionTypes, } from "./sdk/types.js";
export * from "./extensions/access_control/index.js";
export { SealingKey, GenerateSealingKey } from "./sdk/sealing.js";
export { createTfheKeypair, createTfhePublicKey } from "./sdk/keygen.js";
export * from "./sdk/v2";
//# sourceMappingURL=fhenix.js.map