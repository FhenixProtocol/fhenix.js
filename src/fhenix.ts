// for mobile
// if (typeof BigInt === "undefined") {
//   global.BigInt = require("big-integer");
// }

export { FhenixClient, FhenixClientSync } from "./sdk/index.js";

export { fhenixsdk } from "./sdk/v2/sdk.js";
export { PermitV2 } from "./sdk/v2/permit.js";

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

export {
  AbstractProvider,
  AbstractSigner,
  EncryptableBool,
  EncryptableUint8,
  EncryptableUint16,
  EncryptableUint32,
  EncryptableUint64,
  EncryptableUint128,
  EncryptableUint256,
  EncryptableAddress,
  Encryptable,
  EncryptableItem,
  SealedBool,
  SealedUint,
  SealedAddress,
  SealedItem,
  PermitV2Interface,
  PermitV2Core,
  PermitV2Options,
  SerializedPermitV2,
  PermissionV2,
} from "./sdk/v2/types.js";

export * from "./extensions/access_control/index.js";

export { SealingKey, GenerateSealingKey } from "./sdk/sealing.js";
