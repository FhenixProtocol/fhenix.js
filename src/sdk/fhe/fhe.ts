export const asyncInitFhevm = async () => {
  // noop
  // fs.readFileSync(wasm);
};

export { TfheClientKey, TfheCompactPublicKey } from "./tfhe.js";
export {
  CompactFheBool,
  CompactFheUint8,
  CompactFheUint16,
  CompactFheUint32,
  CompactFheUint64,
  CompactFheUint128,
  CompactFheUint160,
  CompactFheUint256,
} from "./tfhe.js";
