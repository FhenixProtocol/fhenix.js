var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TfheCompactPublicKey, TfheConfigBuilder, TfheClientKey, ShortintParameters, ShortintParametersName, } from "node-tfhe";
import { toHexString } from "../utils";
export const createTfheKeypair = () => {
    const block_params = new ShortintParameters(ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS);
    const config = TfheConfigBuilder.default()
        .use_custom_parameters(block_params)
        .build();
    const clientKey = TfheClientKey.generate(config);
    let publicKey = TfheCompactPublicKey.new(clientKey);
    publicKey = TfheCompactPublicKey.deserialize(publicKey.serialize());
    return { clientKey, publicKey };
};
export const createTfhePublicKey = () => {
    const { publicKey } = createTfheKeypair();
    return toHexString(publicKey.serialize());
};
export const asyncInitFhevm = () => __awaiter(void 0, void 0, void 0, function* () {
    // noop
    // fs.readFileSync(wasm);
});
export { TfheCompactPublicKey } from "node-tfhe";
export { CompactFheBoolList, CompactFheUint8List, CompactFheUint16List, CompactFheUint32List, CompactFheUint64List, CompactFheUint128, CompactFheUint160, CompactFheUint256, } from "node-tfhe";
//# sourceMappingURL=fhe.js.map