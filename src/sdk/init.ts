import { SupportedProvider } from './types';
import { TfheCompactPublicKey, asyncInitFhevm } from './fhe/fhe.js';

export const GetFhePublicKey = async (getKeyFn: Function, provider: SupportedProvider): Promise<TfheCompactPublicKey> => {
  // //@ts-ignore
  // const wasm = await import("node_tfhe/tfhe_bg.wasm");
  await asyncInitFhevm();
  return getKeyFn(provider);
}
