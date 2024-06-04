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
exports.CompactFheUint256 = exports.CompactFheUint160 = exports.CompactFheUint128 = exports.CompactFheUint64List = exports.CompactFheUint32List = exports.CompactFheUint16List = exports.CompactFheUint8List = exports.CompactFheBoolList = exports.TfheCompactPublicKey = exports.asyncInitFhevm = exports.createTfhePublicKey = exports.createTfheKeypair = void 0;
const node_tfhe_1 = require("node-tfhe");
const utils_1 = require("../utils");
const createTfheKeypair = () => {
    const block_params = new node_tfhe_1.ShortintParameters(node_tfhe_1.ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS);
    const config = node_tfhe_1.TfheConfigBuilder.default()
        .use_custom_parameters(block_params)
        .build();
    const clientKey = node_tfhe_1.TfheClientKey.generate(config);
    let publicKey = node_tfhe_1.TfheCompactPublicKey.new(clientKey);
    publicKey = node_tfhe_1.TfheCompactPublicKey.deserialize(publicKey.serialize());
    return { clientKey, publicKey };
};
exports.createTfheKeypair = createTfheKeypair;
const createTfhePublicKey = () => {
    const { publicKey } = (0, exports.createTfheKeypair)();
    return (0, utils_1.toHexString)(publicKey.serialize());
};
exports.createTfhePublicKey = createTfhePublicKey;
const asyncInitFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    // noop
    // fs.readFileSync(wasm);
});
exports.asyncInitFhevm = asyncInitFhevm;
var node_tfhe_2 = require("node-tfhe");
Object.defineProperty(exports, "TfheCompactPublicKey", { enumerable: true, get: function () { return node_tfhe_2.TfheCompactPublicKey; } });
var node_tfhe_3 = require("node-tfhe");
Object.defineProperty(exports, "CompactFheBoolList", { enumerable: true, get: function () { return node_tfhe_3.CompactFheBoolList; } });
Object.defineProperty(exports, "CompactFheUint8List", { enumerable: true, get: function () { return node_tfhe_3.CompactFheUint8List; } });
Object.defineProperty(exports, "CompactFheUint16List", { enumerable: true, get: function () { return node_tfhe_3.CompactFheUint16List; } });
Object.defineProperty(exports, "CompactFheUint32List", { enumerable: true, get: function () { return node_tfhe_3.CompactFheUint32List; } });
Object.defineProperty(exports, "CompactFheUint64List", { enumerable: true, get: function () { return node_tfhe_3.CompactFheUint64List; } });
Object.defineProperty(exports, "CompactFheUint128", { enumerable: true, get: function () { return node_tfhe_3.CompactFheUint128; } });
Object.defineProperty(exports, "CompactFheUint160", { enumerable: true, get: function () { return node_tfhe_3.CompactFheUint160; } });
Object.defineProperty(exports, "CompactFheUint256", { enumerable: true, get: function () { return node_tfhe_3.CompactFheUint256; } });
//# sourceMappingURL=fhe.js.map