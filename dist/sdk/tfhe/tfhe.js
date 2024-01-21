"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTfhePublicKey = exports.createTfheKeypair = void 0;
const node_tfhe_1 = require("node-tfhe");
const utils_1 = require("../utils");
const createTfheKeypair = () => {
    const block_params = new node_tfhe_1.ShortintParameters(node_tfhe_1.ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS);
    const config = node_tfhe_1.TfheConfigBuilder.all_disabled()
        .enable_custom_integers(block_params)
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
//# sourceMappingURL=tfhe.js.map