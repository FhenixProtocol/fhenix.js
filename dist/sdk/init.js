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
exports.initFhevm = void 0;
/// #if DEBUG
/// #else
const tfhe_1 = __importDefault(require("tfhe"));
const tfhe_bg_wasm_1 = __importDefault(require("tfhe/tfhe_bg.wasm"));
let initialized;
const initFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!initialized) {
        initialized = yield (0, tfhe_1.default)(tfhe_bg_wasm_1.default);
    }
    return initialized;
});
exports.initFhevm = initFhevm;
/// #endif
//# sourceMappingURL=init.js.map