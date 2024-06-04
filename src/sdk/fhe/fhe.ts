import {
  TfheCompactPublicKey,
  TfheConfigBuilder,
  TfheClientKey,
  ShortintParameters,
  ShortintParametersName,
} from "node-tfhe";
import { toHexString } from "../utils";

export const createTfheKeypair = () => {

  const block_params = new ShortintParameters(
    ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS,
  );
  const config = TfheConfigBuilder.default()
    .use_custom_parameters(block_params)
    .build();
  const clientKey = TfheClientKey.generate(config);
  let publicKey = TfheCompactPublicKey.new(clientKey);
  publicKey = TfheCompactPublicKey.deserialize(publicKey.serialize());
  return { clientKey, publicKey };
};

export const createTfhePublicKey = (): string => {
  const { publicKey } = createTfheKeypair();
  return toHexString(publicKey.serialize());
};

export const asyncInitFhevm = async () => {
  // noop
  // fs.readFileSync(wasm);
}

export { TfheCompactPublicKey } from "node-tfhe";
export {
  CompactFheBoolList,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
  CompactFheUint64List,
  CompactFheUint128,
  CompactFheUint160,
  CompactFheUint256,
} from "node-tfhe";