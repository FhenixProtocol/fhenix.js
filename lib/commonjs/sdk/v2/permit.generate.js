"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignatureDomain = exports.getSignatureTypesAndMessage = exports.SignatureTypes = void 0;
const ethers_1 = require("ethers");
const PermitV2SignatureAllFields = [
    { name: "issuer", type: "address" },
    { name: "expiration", type: "uint64" },
    { name: "contracts", type: "address[]" },
    { name: "projects", type: "string[]" },
    { name: "recipient", type: "address" },
    { name: "validatorId", type: "uint256" },
    { name: "validatorContract", type: "address" },
    { name: "sealingKey", type: "bytes32" },
    { name: "issuerSignature", type: "bytes" },
];
exports.SignatureTypes = {
    PermissionedV2IssuerSelf: [
        "issuer",
        "expiration",
        "contracts",
        "projects",
        "recipient",
        "validatorId",
        "validatorContract",
        "sealingKey",
    ],
    PermissionedV2IssuerShared: [
        "issuer",
        "expiration",
        "contracts",
        "projects",
        "recipient",
        "validatorId",
        "validatorContract",
    ],
    PermissionedV2Recipient: [
        "sealingKey",
        "issuerSignature",
    ],
};
const getSignatureTypesAndMessage = (primaryType, fields, values) => {
    const types = {
        [primaryType]: PermitV2SignatureAllFields.filter((fieldType) => fields.includes(fieldType.name)),
    };
    const message = {};
    fields.forEach((field) => {
        if (field in values) {
            message[field] = values[field];
        }
    });
    return { types, primaryType, message: message };
};
exports.getSignatureTypesAndMessage = getSignatureTypesAndMessage;
const getSignatureDomain = (chainId) => ({
    name: "Fhenix Permission v2.0.0",
    version: "v2.0.0",
    chainId: parseInt(chainId),
    verifyingContract: ethers_1.ZeroAddress,
});
exports.getSignatureDomain = getSignatureDomain;
//# sourceMappingURL=permit.generate.js.map