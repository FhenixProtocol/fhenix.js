// for mobile
// if (typeof BigInt === "undefined") {
//   global.BigInt = require("big-integer");
// }

export {
 FhenixClient,
} from "./sdk/index";

export {
  ContractPermits,
  InstanceParams,
  SupportedProvider,
  EncryptionTypes,
  HardhatEthersProvider,
  EthersProvider
} from './sdk/types';

export * from "./extensions/access_control";

export {
  SealingKey,
  GenerateSealingKey
} from "./sdk/sealing";


