"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHexString = exports.createTfhePublicKey = exports.createTfheKeypair = void 0;
const tfhe_1 = require("./fhe/tfhe");
const createTfheKeypair = () => {
    // const block_params = new ShortintParameters(
    //   ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS,
    // );
    const config = tfhe_1.TfheConfigBuilder.default()
        //..(block_params)
        .build();
    const clientKey = tfhe_1.TfheClientKey.generate(config);
    let publicKey = tfhe_1.TfheCompactPublicKey.new(clientKey);
    publicKey = tfhe_1.TfheCompactPublicKey.deserialize(publicKey.serialize());
    return { clientKey, publicKey };
};
exports.createTfheKeypair = createTfheKeypair;
const createTfhePublicKey = () => {
    const { publicKey } = (0, exports.createTfheKeypair)();
    return (0, exports.toHexString)(publicKey.serialize());
};
exports.createTfhePublicKey = createTfhePublicKey;
const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
exports.toHexString = toHexString;
//# sourceMappingURL=keygen.js.map