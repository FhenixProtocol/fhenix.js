import { asyncInitFhevm } from "./fhe/fhe.js";

// INFO: The existing `GetFhePublicKey` function has been replaced with `InitFhevm`
// `GetFhePublicKey` didn't allow security zones to be set, and was overloaded with initializing the Fhevm
// Public key fetching has been moved to the Async and Sync FhenixClient constructors (they handle it slightly differently)
// - arch 2024-08-28
export const InitFhevm = async () => {
  // `asyncInitFhevm` in `/sdk/fhe/fhe.ts` in node env (noop)
  // `asyncInitFhevm` in `/sdk/fhe/fhe-browser.ts` in browser env (init wasm)
  await asyncInitFhevm();
};
