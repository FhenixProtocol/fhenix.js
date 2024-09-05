var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import wasm from "./tfhe_bg.wasm";
//@ts-expect-error imports from different wasm/js files are wonky
import initSDK from "./tfhe.js";
let initialized;
const initFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!initialized) {
        try {
            initialized = yield initSDK(wasm);
        }
        catch (_) {
            initialized = yield initSDK(wasm());
        }
    }
    return initialized;
});
export const asyncInitFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield initFhevm();
    }
    catch (err) {
        throw new Error(`Error initializing FhenixClient ${err}`);
    }
});
export { TfheCompactPublicKey } from "./tfhe.js";
export { CompactFheBool, CompactFheUint8, CompactFheUint16, CompactFheUint32, CompactFheUint64, CompactFheUint128, CompactFheUint160, CompactFheUint256, } from "./tfhe.js";
//# sourceMappingURL=fhe-browser.js.map