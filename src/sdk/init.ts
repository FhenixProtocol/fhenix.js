import initSDK, { InitOutput } from 'tfhe';


let initialized: InitOutput;

type InitFhevm = typeof initSDK;

export const initFhevm: InitFhevm = async () => {
  // let wasm = await import_wasm();
  if (!initialized) {
    initialized = await initSDK();
  }
  return initialized;
};


