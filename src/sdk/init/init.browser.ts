import initSDK, { InitOutput } from "tfhe";
import wasm from "tfhe/tfhe_bg.wasm";
import { SupportedProvider } from '../types';
import { TfheCompactPublicKey } from 'node-tfhe';

let initialized: InitOutput;

type InitFhevm = typeof initSDK;

export const initFhevm: InitFhevm = async () => {
  if (!initialized) {
    initialized = await initSDK(wasm);
  }
  return initialized;
};

const asyncInitFhevm: () => Promise<void> = async () => {
  try {
    // const { initFhevm } = await import("./init.js");
    await initFhevm();
  } catch (err) {
    throw new Error(
      `Error initializing FhenixClient - maybe try calling with initSdk: false. ${err}`,
    );
  }
};

export const GetFhePublicKey = async (getKeyFn: Function, provider: SupportedProvider): Promise<TfheCompactPublicKey> => {
  await asyncInitFhevm();
  return getKeyFn(provider);

  // if (params?.initSdk !== false) {
  //
  // } else {
  //   this.fhePublicKey = FhenixClient.getFheKeyFromProvider(provider).catch(
  //     (err) => {
  //       if (ignoreErrors) {
  //         return undefined;
  //       } else {
  //         throw new Error(
  //           `Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`,
  //         );
  //       }
  //     },
  //   );
  // }
}
