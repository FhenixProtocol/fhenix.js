import { ZeroAddress } from "ethers";
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
export const SignatureTypes = {
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
export const getSignatureTypesAndMessage = (primaryType, fields, values) => {
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
export const getSignatureDomain = (chainId) => ({
    name: "Fhenix Permission v2.0.0",
    version: "v2.0.0",
    chainId: parseInt(chainId),
    verifyingContract: ZeroAddress,
});
//# sourceMappingURL=generate.js.map