"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactFheUint256 = exports.CompactFheUint160 = exports.CompactFheUint128 = exports.CompactFheUint64 = exports.CompactFheUint32 = exports.CompactFheUint16 = exports.CompactFheUint8 = exports.CompactFheBool = exports.TfheCompactPublicKey = void 0;
const wasm = __importStar(require("./tfhe_bg.wasm"));
const tfhe_bg_js_1 = require("./tfhe_bg.js");
(0, tfhe_bg_js_1.__wbg_set_wasm)(wasm);
__exportStar(require("./tfhe_bg.js"), exports);
var tfhe_bg_js_2 = require("./tfhe_bg.js");
Object.defineProperty(exports, "TfheCompactPublicKey", { enumerable: true, get: function () { return tfhe_bg_js_2.TfheCompactPublicKey; } });
var tfhe_bg_js_3 = require("./tfhe_bg.js");
Object.defineProperty(exports, "CompactFheBool", { enumerable: true, get: function () { return tfhe_bg_js_3.CompactFheBool; } });
Object.defineProperty(exports, "CompactFheUint8", { enumerable: true, get: function () { return tfhe_bg_js_3.CompactFheUint8; } });
Object.defineProperty(exports, "CompactFheUint16", { enumerable: true, get: function () { return tfhe_bg_js_3.CompactFheUint16; } });
Object.defineProperty(exports, "CompactFheUint32", { enumerable: true, get: function () { return tfhe_bg_js_3.CompactFheUint32; } });
Object.defineProperty(exports, "CompactFheUint64", { enumerable: true, get: function () { return tfhe_bg_js_3.CompactFheUint64; } });
Object.defineProperty(exports, "CompactFheUint128", { enumerable: true, get: function () { return tfhe_bg_js_3.CompactFheUint128; } });
Object.defineProperty(exports, "CompactFheUint160", { enumerable: true, get: function () { return tfhe_bg_js_3.CompactFheUint160; } });
Object.defineProperty(exports, "CompactFheUint256", { enumerable: true, get: function () { return tfhe_bg_js_3.CompactFheUint256; } });
//# sourceMappingURL=tfhe.js.map