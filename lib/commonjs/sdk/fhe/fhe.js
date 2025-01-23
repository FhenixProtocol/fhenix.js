"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactFheUint256 = exports.CompactFheUint160 = exports.CompactFheUint128 = exports.CompactFheUint64 = exports.CompactFheUint32 = exports.CompactFheUint16 = exports.CompactFheUint8 = exports.CompactFheBool = exports.TfheCompactPublicKey = exports.TfheClientKey = exports.asyncInitFhevm = void 0;
const asyncInitFhevm = async () => {
    // noop
    // fs.readFileSync(wasm);
};
exports.asyncInitFhevm = asyncInitFhevm;
var tfhe_js_1 = require("./tfhe.js");
Object.defineProperty(exports, "TfheClientKey", { enumerable: true, get: function () { return tfhe_js_1.TfheClientKey; } });
Object.defineProperty(exports, "TfheCompactPublicKey", { enumerable: true, get: function () { return tfhe_js_1.TfheCompactPublicKey; } });
var tfhe_js_2 = require("./tfhe.js");
Object.defineProperty(exports, "CompactFheBool", { enumerable: true, get: function () { return tfhe_js_2.CompactFheBool; } });
Object.defineProperty(exports, "CompactFheUint8", { enumerable: true, get: function () { return tfhe_js_2.CompactFheUint8; } });
Object.defineProperty(exports, "CompactFheUint16", { enumerable: true, get: function () { return tfhe_js_2.CompactFheUint16; } });
Object.defineProperty(exports, "CompactFheUint32", { enumerable: true, get: function () { return tfhe_js_2.CompactFheUint32; } });
Object.defineProperty(exports, "CompactFheUint64", { enumerable: true, get: function () { return tfhe_js_2.CompactFheUint64; } });
Object.defineProperty(exports, "CompactFheUint128", { enumerable: true, get: function () { return tfhe_js_2.CompactFheUint128; } });
Object.defineProperty(exports, "CompactFheUint160", { enumerable: true, get: function () { return tfhe_js_2.CompactFheUint160; } });
Object.defineProperty(exports, "CompactFheUint256", { enumerable: true, get: function () { return tfhe_js_2.CompactFheUint256; } });
//# sourceMappingURL=fhe.js.map