import wasm from "tfhe/tfhe_bg.wasm";
import initSDK, { InitOutput } from "tfhe";

let initialized: InitOutput;
export type InitFhevm = typeof initSDK;

const initFhevm: InitFhevm = async () => {
  if (!initialized) {
    //@ts-ignore
    initialized = await initSDK(wasm());
  }
  return initialized;
};

export const asyncInitFhevm: () => Promise<void> = async () => {
  try {
    // const { initFhevm } = await import("./init.js");
    console.log('initFhevm');

    await initFhevm();
  } catch (err) {
    throw new Error(
      `Error initializing FhenixClient - maybe try calling with initSdk: false. ${err}`,
    );
  }
};

export { TfheCompactPublicKey } from "tfhe";
export {
  CompactFheBoolList,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
  CompactFheUint64List,
  CompactFheUint128,
  CompactFheUint160,
  CompactFheUint256,
} from "tfhe";