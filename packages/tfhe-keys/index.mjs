import {
  TfheCompactPublicKey,
  TfheConfigBuilder,
  TfheClientKey,
  ShortintParameters,
  ShortintParametersName,
} from "node-tfhe";

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

export const createTfhePublicKey = () => {
  const { publicKey } = createTfheKeypair();
  return toHexString(publicKey.serialize());
};

export const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

export { TfheCompactPublicKey, TfheClientKey } from "node-tfhe";
export {
  CompactFheBool,
  CompactFheUint8,
  CompactFheUint16,
  CompactFheUint32,
  CompactFheUint64,
  CompactFheUint128,
  CompactFheUint160,
  CompactFheUint256,
} from "node-tfhe";