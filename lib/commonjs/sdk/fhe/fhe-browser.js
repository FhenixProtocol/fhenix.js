"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactFheUint256 = exports.CompactFheUint160 = exports.CompactFheUint128 = exports.CompactFheUint64 = exports.CompactFheUint32 = exports.CompactFheUint16 = exports.CompactFheUint8 = exports.CompactFheBool = exports.TfheCompactPublicKey = exports.asyncInitFhevm = void 0;
const tfhe_bg_wasm_1 = __importDefault(require("./tfhe_bg.wasm"));
//@ts-expect-error imports from different wasm/js files are wonky
const tfhe_js_1 = __importDefault(require("./tfhe.js"));
let initialized;
const initFhevm = async () => {
    if (!initialized) {
        try {
            initialized = await (0, tfhe_js_1.default)(tfhe_bg_wasm_1.default);
        }
        catch (_) {
            initialized = await (0, tfhe_js_1.default)((0, tfhe_bg_wasm_1.default)());
        }
    }
    return initialized;
};
const asyncInitFhevm = async () => {
    try {
        await initFhevm();
    }
    catch (err) {
        throw new Error(`Error initializing FhenixClient ${err}`);
    }
};
exports.asyncInitFhevm = asyncInitFhevm;
var tfhe_js_2 = require("./tfhe.js");
Object.defineProperty(exports, "TfheCompactPublicKey", { enumerable: true, get: function () { return tfhe_js_2.TfheCompactPublicKey; } });
var tfhe_js_3 = require("./tfhe.js");
Object.defineProperty(exports, "CompactFheBool", { enumerable: true, get: function () { return tfhe_js_3.CompactFheBool; } });
Object.defineProperty(exports, "CompactFheUint8", { enumerable: true, get: function () { return tfhe_js_3.CompactFheUint8; } });
Object.defineProperty(exports, "CompactFheUint16", { enumerable: true, get: function () { return tfhe_js_3.CompactFheUint16; } });
Object.defineProperty(exports, "CompactFheUint32", { enumerable: true, get: function () { return tfhe_js_3.CompactFheUint32; } });
Object.defineProperty(exports, "CompactFheUint64", { enumerable: true, get: function () { return tfhe_js_3.CompactFheUint64; } });
Object.defineProperty(exports, "CompactFheUint128", { enumerable: true, get: function () { return tfhe_js_3.CompactFheUint128; } });
Object.defineProperty(exports, "CompactFheUint160", { enumerable: true, get: function () { return tfhe_js_3.CompactFheUint160; } });
Object.defineProperty(exports, "CompactFheUint256", { enumerable: true, get: function () { return tfhe_js_3.CompactFheUint256; } });
//# sourceMappingURL=fhe-browser.js.map