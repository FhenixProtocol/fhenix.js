// for mobile
// if (typeof BigInt === "undefined") {
//   global.BigInt = require("big-integer");
// }

export { FhenixClient, FhenixClientSync } from "./sdk/index.js";

export {
  ContractPermits,
  InstanceParams,
  SupportedProvider,
  EncryptionTypes,
  EncryptedUint64,
  EncryptedUint128,
  EncryptedUint256,
  EncryptedUint32,
  EncryptedUint16,
  EncryptedUint8,
  EncryptedBool,
  EncryptedNumber,
  EncryptedAddress,
} from "./sdk/types.js";

export * from "./extensions/access_control/index.js";

export { SealingKey, GenerateSealingKey } from "./sdk/sealing.js";
