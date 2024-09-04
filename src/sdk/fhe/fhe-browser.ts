import wasm from "./tfhe_bg.wasm";
//@ts-expect-error imports from different wasm/js files are wonky
import initSDK, { InitOutput } from "./tfhe.js";

let initialized: InitOutput;
export type InitFhevm = typeof initSDK;

const initFhevm: InitFhevm = async () => {
  if (!initialized) {
    try {
      initialized = await initSDK(wasm);
    } catch (_) {
      initialized = await initSDK(wasm());
    }
  }
  return initialized;
};

export const asyncInitFhevm: () => Promise<void> = async () => {
  try {
    await initFhevm();
  } catch (err) {
    throw new Error(`Error initializing FhenixClient ${err}`);
  }
};

export { TfheCompactPublicKey } from "./tfhe.js";
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
