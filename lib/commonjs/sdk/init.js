"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitFhevm = void 0;
const fhe_js_1 = require("./fhe/fhe.js");
// INFO: The existing `GetFhePublicKey` function has been replaced with `InitFhevm`
// `GetFhePublicKey` didn't allow security zones to be set, and was overloaded with initializing the Fhevm
// Public key fetching has been moved to the Async and Sync FhenixClient constructors (they handle it slightly differently)
// - arch 2024-08-28
const InitFhevm = async () => {
    // `asyncInitFhevm` in `/sdk/fhe/fhe.ts` in node env (noop)
    // `asyncInitFhevm` in `/sdk/fhe/fhe-browser.ts` in browser env (init wasm)
    await (0, fhe_js_1.asyncInitFhevm)();
};
exports.InitFhevm = InitFhevm;
//# sourceMappingURL=init.js.map