import { SupportedProvider } from "./types.js";
import { TfheCompactPublicKey, asyncInitFhevm } from "./fhe/fhe.js";

export const GetFhePublicKey = async (
  getKeyFn: (provider: SupportedProvider) => Promise<TfheCompactPublicKey>,
  provider: SupportedProvider,
): Promise<TfheCompactPublicKey> => {
  await asyncInitFhevm();
  return getKeyFn(provider);
};
