"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitFhevm = void 0;
const fhe_js_1 = require("./fhe/fhe.js");
// INFO: The existing `GetFhePublicKey` function has been replaced with `InitFhevm`
// `GetFhePublicKey` didn't allow security zones to be set, and was overloaded with initializing the Fhevm
// Public key fetching has been moved to the Async and Sync FhenixClient constructors (they handle it slightly differently)
// - arch 2024-08-28
const InitFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    // `asyncInitFhevm` in `/sdk/fhe/fhe.ts` in node env (noop)
    // `asyncInitFhevm` in `/sdk/fhe/fhe-browser.ts` in browser env (init wasm)
    yield (0, fhe_js_1.asyncInitFhevm)();
});
exports.InitFhevm = InitFhevm;
//# sourceMappingURL=init.js.map