/// #if DEBUG
/// #else
import initSDK, { InitOutput } from "tfhe";
import wasm from "tfhe/tfhe_bg.wasm";

let initialized: InitOutput;

type InitFhevm = typeof initSDK;

export const initFhevm: InitFhevm = async () => {
  if (!initialized) {
    initialized = await initSDK(wasm);
  }
  return initialized;
};
/// #endif
