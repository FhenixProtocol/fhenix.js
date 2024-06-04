var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import wasm from "tfhe/tfhe_bg.wasm";
import initSDK from "tfhe";
let initialized;
const initFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!initialized) {
        //@ts-ignore
        initialized = yield initSDK(wasm());
    }
    return initialized;
});
export const asyncInitFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { initFhevm } = await import("./init.js");
        console.log('initFhevm');
        yield initFhevm();
    }
    catch (err) {
        throw new Error(`Error initializing FhenixClient - maybe try calling with initSdk: false. ${err}`);
    }
});
export { TfheCompactPublicKey } from "tfhe";
export { CompactFheBoolList, CompactFheUint8List, CompactFheUint16List, CompactFheUint32List, CompactFheUint64List, CompactFheUint128, CompactFheUint160, CompactFheUint256, } from "tfhe";
//# sourceMappingURL=fhe-browser.js.map