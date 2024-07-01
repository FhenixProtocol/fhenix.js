import * as wasm from "./tfhe_bg.wasm";
import { __wbg_set_wasm } from "./tfhe_bg.js";
__wbg_set_wasm(wasm);
export * from "./tfhe_bg.js";
export { TfheCompactPublicKey } from "./tfhe_bg.js";
export { CompactFheBool, CompactFheUint8, CompactFheUint16, CompactFheUint32, CompactFheUint64, CompactFheUint128, CompactFheUint160, CompactFheUint256, } from "./tfhe_bg.js";
//# sourceMappingURL=tfhe.js.map