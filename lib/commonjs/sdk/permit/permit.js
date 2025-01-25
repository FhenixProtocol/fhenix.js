"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermitV2 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ethers_1 = require("ethers");
const generate_1 = require("./generate");
const permit_z_1 = require("./permit.z");
const sealing_1 = require("../sealing");
const utils_hardhat_1 = require("../utils.hardhat");
const types_1 = require("../../types");
class PermitV2 {
    constructor(options, metadata) {
        /**
         * Chain that this permit was signed on. In part used for mock encrypt/unseal on hardhat network.
         * Should not be set manually, included in metadata as part of serialization flows.
         */
        this._signedChainId = undefined;
        this.updateName = (name) => {
            this.name = name;
        };
        /**
         * Utility to extract the public data from a permit.
         * Used in `serialize`, `getPermission`, `getHash` etc
         */
        this.getInterface = () => {
            return {
                name: this.name,
                type: this.type,
                issuer: this.issuer,
                expiration: this.expiration,
                contracts: this.contracts,
                projects: this.projects,
                recipient: this.recipient,
                validatorId: this.validatorId,
                validatorContract: this.validatorContract,
                sealingPair: this.sealingPair,
                issuerSignature: this.issuerSignature,
                recipientSignature: this.recipientSignature,
            };
        };
        /**
         * Export the necessary permit data to share a permit with another user
         */
        this.export = () => {
            const cleanedPermit = {
                name: this.name,
                type: this.type,
                issuer: this.issuer,
                expiration: this.expiration,
            };
            if (this.contracts.length > 0)
                cleanedPermit.contracts = this.contracts;
            if (this.projects.length > 0)
                cleanedPermit.projects = this.projects;
            if (this.recipient !== ethers_1.ZeroAddress)
                cleanedPermit.recipient = this.recipient;
            if (this.validatorId !== 0)
                cleanedPermit.validatorId = this.validatorId;
            if (this.validatorContract !== ethers_1.ZeroAddress)
                cleanedPermit.validatorContract = this.validatorContract;
            if (this.type === "sharing" && this.issuerSignature !== "0x")
                cleanedPermit.issuerSignature = this.issuerSignature;
            return JSON.stringify(cleanedPermit, undefined, 2);
        };
        /**
         * Returns a serializable permit instance, removing classes and methods.
         * NOTE: Does not return a stringified permit
         */
        this.serialize = () => {
            const { sealingPair, ...permit } = this.getInterface();
            return {
                ...permit,
                _signedChainId: this._signedChainId,
                sealingPair: {
                    publicKey: sealingPair.publicKey,
                    privateKey: sealingPair.privateKey,
                },
            };
        };
        /**
         * Extracts a contract input ready permission from this permit.
         * The permission inherits most fields from the permit, however
         * `permit.sealingPair` is removed and replaced by `permit.sealingPair.publicKey` in the `sealingKey` field.
         *
         * @permit {boolean} skipValidation - Flag to prevent running validation on the permit before returning the extracted permission. Used internally.
         * @returns {PermissionV2}
         */
        this.getPermission = (skipValidation = false) => {
            const permitData = this.getInterface();
            if (!skipValidation) {
                const validationResult = permit_z_1.FullyFormedPermitV2Validator.safeParse(permitData);
                if (!validationResult.success) {
                    throw new Error(`PermitV2 :: getPermission :: permit validation failed - ${JSON.stringify(validationResult.error, null, 2)} ${JSON.stringify(permitData, null, 2)}`);
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { name, type, sealingPair, ...permit } = permitData;
            return {
                ...permit,
                sealingKey: `0x${sealingPair.publicKey}`,
            };
        };
        /**
         * Returns a stable hash depending on the core data of the permit.
         * Is used in the store as each permit's key in the permit map.
         */
        this.getHash = () => (0, ethers_1.keccak256)((0, ethers_1.id)(JSON.stringify({
            type: this.type,
            issuer: this.issuer,
            expiration: this.expiration,
            contracts: this.contracts,
            projects: this.projects,
            recipient: this.recipient,
            validatorId: this.validatorId,
            validatorContract: this.validatorContract,
        })));
        /**
         * Returns the domain, types, primaryType, and message fields required to request the user's signature
         * Primary type is returned to allow viem clients to more easily connect
         */
        this.getSignatureParams = (chainId, primaryType) => {
            return {
                domain: (0, generate_1.getSignatureDomain)(chainId),
                ...(0, generate_1.getSignatureTypesAndMessage)(primaryType, generate_1.SignatureTypes[primaryType], this.getPermission(true)),
            };
        };
        /**
         * Determines the required signature type.
         * Creates the EIP712 types and message.
         * Prompts the user for their signature.
         * Inserts the signature into `issuerSignature` or `recipientSignature` as necessary.
         *
         * @param {string} chainId - Used as part of the EIP712 domain, throws if undefined
         * @param {AbstractSigner} signer - Signer responsible for signing the EIP712 permit signature, throws if undefined
         */
        this.sign = async (chainId, signer) => {
            if (chainId == null)
                throw new Error("PermitV2 :: sign - chainId undefined, cannot sign a permit with an unknown chainId");
            if (signer == null)
                throw new Error("PermitV2 :: sign - signer undefined, you must pass in a `signer` for the connected user to create a permitV2 signature");
            let primaryType = "PermissionedV2IssuerSelf";
            if (this.type === "self")
                primaryType = "PermissionedV2IssuerSelf";
            if (this.type === "sharing")
                primaryType = "PermissionedV2IssuerShared";
            if (this.type === "recipient")
                primaryType = "PermissionedV2Recipient";
            const { domain, types, message } = this.getSignatureParams(chainId, primaryType);
            const signature = await signer.signTypedData(domain, types, message);
            if (this.type === "self" || this.type === "sharing") {
                this.issuerSignature = signature;
            }
            if (this.type === "recipient") {
                this.recipientSignature = signature;
            }
            this._signedChainId = chainId;
        };
        /**
         * Use the privateKey of `permit.sealingPair` to unseal `ciphertext` returned from the Fhenix chain.
         * Useful when not using `SealedItem` structs and need to unseal an individual ciphertext.
         */
        this.unsealCiphertext = (ciphertext) => {
            // Early exit with mock unseal if interacting with hardhat network
            if ((0, utils_hardhat_1.chainIsHardhat)(this._signedChainId))
                return (0, utils_hardhat_1.hardhatMockUnseal)(ciphertext);
            return this.sealingPair.unseal(ciphertext);
        };
        /**
         * Check if permit satisfies the requirements param.
         * Permit must satisfy either the contracts list or the projects list
         *
         * @param {{contracts?: string[], projects?: string[]}} requirements - Lists of contract and project requirements.
         * @returns {satisfies: boolean, unsatisfiedContracts, unsatisfiedProjects} - satisfied if either req list is fulfilled.
         */
        this.getSatisfies = (requirements) => {
            let contractsSatisfied = true;
            const unsatisfiedContracts = [];
            for (const contract in requirements.contracts) {
                if (!this.contracts.includes(contract)) {
                    contractsSatisfied = false;
                    unsatisfiedContracts.push(contract);
                }
            }
            let projectsSatisfied = true;
            const unsatisfiedProjects = [];
            for (const project in requirements.projects) {
                if (!this.projects.includes(project)) {
                    projectsSatisfied = false;
                    unsatisfiedProjects.push(project);
                }
            }
            if (contractsSatisfied || projectsSatisfied)
                return {
                    satisfies: true,
                    unsatisfiedContracts: null,
                    unsatisfiedProjects: null,
                };
            return {
                satisfies: false,
                unsatisfiedContracts,
                unsatisfiedProjects,
            };
        };
        /**
         * Returns whether the active party has created their signature.
         * If `permit.type` is self or sharing, the active party is `issuer`.
         * If `permit.type` is recipient, the active party is `recipient`
         *
         * @returns {boolean}
         */
        this.isSigned = () => {
            if (this.type === "self" || this.type === "sharing") {
                return this.issuerSignature !== "0x";
            }
            if (this.type === "recipient") {
                return this.recipientSignature != "0x";
            }
            return false;
        };
        /**
         * Returns whether this permit has expired due to `permit.expiration`
         *
         * @returns {boolean}
         */
        this.isExpired = () => {
            return this.expiration < Math.floor(Date.now() / 1000);
        };
        /**
         * Overall validity checker of a permit, checks the signatures and expirations
         *
         * @returns {{valid: boolean, error: string}} - If `valid`, `error` is null, else `error` indicates which validity check failed
         */
        this.isValid = () => {
            if (this.isExpired())
                return { valid: false, error: "expired" };
            if (!this.isSigned())
                return { valid: false, error: "not-signed" };
            return { valid: true, error: null };
        };
        this.name = options.name;
        this.type = options.type;
        this.issuer = options.issuer;
        this.expiration = options.expiration;
        this.contracts = options.contracts;
        this.projects = options.projects;
        this.recipient = options.recipient;
        this.validatorId = options.validatorId;
        this.validatorContract = options.validatorContract;
        this.sealingPair = options.sealingPair;
        this.issuerSignature = options.issuerSignature;
        this.recipientSignature = options.recipientSignature;
        this._signedChainId = metadata?._signedChainId;
    }
    static async create(options) {
        const { success, data: parsed, error, } = permit_z_1.PermitV2ParamsValidator.safeParse(options);
        if (!success) {
            throw new Error("PermitV2 :: create :: Parsing PermitV2Options failed " +
                JSON.stringify(error, null, 2));
        }
        const sealingPair = parsed.sealingPair != null
            ? new sealing_1.SealingKey(parsed.sealingPair.privateKey, parsed.sealingPair.publicKey)
            : await (0, sealing_1.GenerateSealingKey)();
        return new PermitV2({
            ...parsed,
            sealingPair,
        });
    }
    static async createAndSign(options, chainId, signer) {
        const permit = await PermitV2.create(options);
        await permit.sign(chainId, signer);
        return permit;
    }
    unseal(item) {
        // SealedItem
        const sealedItem = (0, types_1.getAsSealedItem)(item);
        if (sealedItem != null) {
            const bn = (0, utils_hardhat_1.chainIsHardhat)(this._signedChainId)
                ? (0, utils_hardhat_1.hardhatMockUnseal)(sealedItem.data)
                : this.sealingPair.unseal(sealedItem.data);
            if ((0, types_1.isSealedBool)(sealedItem)) {
                // Return a boolean for SealedBool
                return Boolean(bn).valueOf();
            }
            if ((0, types_1.isSealedAddress)(sealedItem)) {
                // Return a string for SealedAddress
                return (0, ethers_1.getAddress)(`0x${bn.toString(16).slice(-40)}`);
            }
            if ((0, types_1.isSealedUint)(sealedItem)) {
                // Return a bigint for SealedUint
                return bn;
            }
        }
        // Object | Array
        if (typeof item === "object" && item !== null) {
            if (Array.isArray(item)) {
                // Array - recurse
                return item.map((nestedItem) => this.unseal(nestedItem));
            }
            else {
                // Object - recurse
                const result = {};
                for (const key in item) {
                    result[key] = this.unseal(item[key]);
                }
                return result;
            }
        }
        // Primitive
        return item;
    }
}
exports.PermitV2 = PermitV2;
/**
 * Creates a `PermitV2` from a serialized permit, hydrating methods and classes
 * NOTE: Does not return a stringified permit
 *
 * @param {SerializedPermitV2} - Permit structure excluding classes
 * @returns {PermitV2} - New instance of PermitV2 class
 */
PermitV2.deserialize = ({ _signedChainId, sealingPair, ...permit }) => {
    return new PermitV2({
        ...permit,
        sealingPair: new sealing_1.SealingKey(sealingPair.privateKey, sealingPair.publicKey),
    }, {
        _signedChainId,
    });
};
PermitV2.validate = (permit) => {
    return permit_z_1.FullyFormedPermitV2Validator.safeParse(permit);
};
//# sourceMappingURL=permit.js.map