import wasm from "./tfhe_bg.wasm";
//@ts-expect-error imports from different wasm/js files are wonky
import initSDK from "./tfhe.js";
let initialized;
const initFhevm = async () => {
    if (!initialized) {
        try {
            initialized = await initSDK(wasm);
        }
        catch (_) {
            initialized = await initSDK(wasm());
        }
    }
    return initialized;
};
export const asyncInitFhevm = async () => {
    try {
        await initFhevm();
    }
    catch (err) {
        throw new Error(`Error initializing FhenixClient ${err}`);
    }
};
export { TfheCompactPublicKey } from "./tfhe.js";
export { CompactFheBool, CompactFheUint8, CompactFheUint16, CompactFheUint32, CompactFheUint64, CompactFheUint128, CompactFheUint160, CompactFheUint256, } from "./tfhe.js";
//# sourceMappingURL=fhe-browser.js.map