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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactFheUint256 = exports.CompactFheUint160 = exports.CompactFheUint128 = exports.CompactFheUint64List = exports.CompactFheUint32List = exports.CompactFheUint16List = exports.CompactFheUint8List = exports.CompactFheBoolList = exports.TfheCompactPublicKey = exports.asyncInitFhevm = void 0;
const tfhe_bg_wasm_1 = __importDefault(require("tfhe/tfhe_bg.wasm"));
const tfhe_1 = __importDefault(require("tfhe"));
let initialized;
const initFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!initialized) {
        initialized = yield (0, tfhe_1.default)((0, tfhe_bg_wasm_1.default)());
    }
    return initialized;
});
const asyncInitFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { initFhevm } = await import("./init.js");
        console.log("initFhevm");
        yield initFhevm();
    }
    catch (err) {
        throw new Error(`Error initializing FhenixClient - maybe try calling with initSdk: false. ${err}`);
    }
});
exports.asyncInitFhevm = asyncInitFhevm;
var tfhe_2 = require("tfhe");
Object.defineProperty(exports, "TfheCompactPublicKey", { enumerable: true, get: function () { return tfhe_2.TfheCompactPublicKey; } });
var tfhe_3 = require("tfhe");
Object.defineProperty(exports, "CompactFheBoolList", { enumerable: true, get: function () { return tfhe_3.CompactFheBoolList; } });
Object.defineProperty(exports, "CompactFheUint8List", { enumerable: true, get: function () { return tfhe_3.CompactFheUint8List; } });
Object.defineProperty(exports, "CompactFheUint16List", { enumerable: true, get: function () { return tfhe_3.CompactFheUint16List; } });
Object.defineProperty(exports, "CompactFheUint32List", { enumerable: true, get: function () { return tfhe_3.CompactFheUint32List; } });
Object.defineProperty(exports, "CompactFheUint64List", { enumerable: true, get: function () { return tfhe_3.CompactFheUint64List; } });
Object.defineProperty(exports, "CompactFheUint128", { enumerable: true, get: function () { return tfhe_3.CompactFheUint128; } });
Object.defineProperty(exports, "CompactFheUint160", { enumerable: true, get: function () { return tfhe_3.CompactFheUint160; } });
Object.defineProperty(exports, "CompactFheUint256", { enumerable: true, get: function () { return tfhe_3.CompactFheUint256; } });
//# sourceMappingURL=fhe-browser.js.map