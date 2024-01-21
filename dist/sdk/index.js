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
exports.FhenixClient = void 0;
const node_tfhe_1 = require("node-tfhe");
const utils_1 = require("./utils");
const types_1 = require("./types");
const ethers_1 = require("ethers");
const consts_1 = require("./consts");
const utils_2 = require("./utils");
const tfheEncrypt = __importStar(require("./encrypt"));
const validation_1 = require("./validation");
/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
class FhenixClient {
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params) {
        this.permits = {};
        (0, validation_1.isPlainObject)(params);
        if ((params === null || params === void 0 ? void 0 : params.provider) === undefined) {
            params.provider = new ethers_1.JsonRpcProvider("http://localhost:8545");
        }
        //// @ts-expect-error make Typescript shut up
        const isInTest = typeof (global === null || global === void 0 ? void 0 : global.it) === "function";
        this.fhePublicKey = Promise.resolve(undefined); // make Typescript shut up
        const { provider } = params;
        // in most cases we will want to init the fhevm library - except if this is used outside of the browser, in which
        // case this should be called with initSdk = false (tests, for instance)
        /// #if DEBUG
        if (isInTest) {
            this.fhePublicKey = FhenixClient.getFheKeyFromProvider(provider);
        }
        /// #else
        if (!isInTest) {
            const asyncInitFhevm = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    if ((params === null || params === void 0 ? void 0 : params.initSdk) !== false) {
                        const { initFhevm } = yield Promise.resolve().then(() => __importStar(require("./init")));
                        yield initFhevm();
                    }
                }
                catch (err) {
                    throw new Error(`Error initializing FhenixClient - maybe try calling with initSdk: false. ${err}`);
                }
            });
            this.fhePublicKey = asyncInitFhevm().then(() => FhenixClient.getFheKeyFromProvider(provider));
        }
        /// #endif
    }
    // Encryption Methods
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
     */
    encrypt_uint8(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isNumber)(value);
            const fhePublicKey = yield this.fhePublicKey;
            if (!fhePublicKey) {
                throw new Error("Public key somehow not initialized");
            }
            (0, utils_2.ValidateUintInRange)(value, consts_1.MAX_UINT8, 0);
            return tfheEncrypt.encrypt_uint8(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a Uint16 value using the stored public key.
     * @param {number} value - The Uint16 value to encrypt.
     * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
     */
    encrypt_uint16(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isNumber)(value);
            const fhePublicKey = yield this.fhePublicKey;
            if (!fhePublicKey) {
                throw new Error("Public key somehow not initialized");
            }
            (0, utils_2.ValidateUintInRange)(value, consts_1.MAX_UINT16, 0);
            return tfheEncrypt.encrypt_uint16(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a Uint32 value using the stored public key.
     * @param {number} value - The Uint32 value to encrypt.
     * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
     */
    encrypt_uint32(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isNumber)(value);
            const fhePublicKey = yield this.fhePublicKey;
            if (!fhePublicKey) {
                throw new Error("Public key somehow not initialized");
            }
            (0, utils_2.ValidateUintInRange)(value, consts_1.MAX_UINT32, 0);
            return tfheEncrypt.encrypt_uint32(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
     * @param {number} value - The numeric value to encrypt.
     * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
     * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
     */
    encrypt(value, type) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isNumber)(value);
            let outputSize = type;
            const fhePublicKey = yield this.fhePublicKey;
            if (!fhePublicKey) {
                throw new Error("Public key somehow not initialized");
            }
            // choose the most efficient ciphertext size if not selected
            if (!outputSize) {
                if (value < consts_1.MAX_UINT8) {
                    outputSize = types_1.EncryptionTypes.uint8;
                }
                else if (value < consts_1.MAX_UINT16) {
                    outputSize = types_1.EncryptionTypes.uint16;
                }
                else if (value < consts_1.MAX_UINT32) {
                    outputSize = types_1.EncryptionTypes.uint32;
                }
                else {
                    throw new Error(`Encryption input must be smaller than ${consts_1.MAX_UINT32}`);
                }
            }
            switch (outputSize) {
                case types_1.EncryptionTypes.uint8:
                    (0, utils_2.ValidateUintInRange)(value, consts_1.MAX_UINT8, 0);
                    break;
                case types_1.EncryptionTypes.uint16:
                    (0, utils_2.ValidateUintInRange)(value, consts_1.MAX_UINT16, 0);
                    break;
                case types_1.EncryptionTypes.uint32:
                    (0, utils_2.ValidateUintInRange)(value, consts_1.MAX_UINT32, 0);
                    break;
            }
            return tfheEncrypt.encrypt(value, fhePublicKey, type);
        });
    }
    // Unsealing Method
    /**
     * Unseals an encrypted message using the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} ciphertext - The encrypted message to unseal.
     * @returns {any} - The unsealed message.
     */
    unseal(contractAddress, ciphertext) {
        (0, utils_1.isAddress)(contractAddress);
        (0, validation_1.isString)(ciphertext);
        if (!this.hasPermit(contractAddress)) {
            throw new Error(`Missing keypair for ${contractAddress}`);
        }
        return this.permits[contractAddress].sealingKey.unseal(ciphertext);
    }
    // Permit Management Methods
    /**
     * Retrieves the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @returns {Permit} - The permit associated with the contract address.
     */
    getPermit(contractAddress) {
        if (!this.hasPermit(contractAddress)) {
            throw new Error(`Missing keypair for ${contractAddress}`);
        }
        return this.permits[contractAddress];
    }
    /**
     * Stores a permit for a specific contract address. Will overwrite any existing permit for the same contract address.
     * Does not store the permit in localstorage (should it?)
     * @param {Permit} permit - The permit to store.
     */
    storePermit(permit) {
        this.permits[permit.contractAddress] = permit;
    }
    /**
     * Removes a stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     */
    removePermit(contractAddress) {
        if (this.hasPermit(contractAddress)) {
            delete this.permits[contractAddress];
        }
    }
    /**
     * Checks if a permit exists for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @returns {boolean} - True if a permit exists, false otherwise.
     */
    hasPermit(contractAddress) {
        return this.permits[contractAddress] !== null;
    }
    /**
     * Exports all stored permits.
     * @returns {ContractPermits} - All stored permits.
     */
    exportPermits() {
        return this.permits;
    }
    extractPermitPermission(permit) {
        return {
            signature: permit.signature,
            publicKey: permit.publicKey,
        };
    }
    // Private helper methods
    /**
     * Retrieves the FHE public key from the provider.
     * @param {SupportedProvider} provider - The provider from which to retrieve the key.
     * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
     */
    static getFheKeyFromProvider(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestMethod = (0, types_1.determineRequestMethod)(provider);
            const chainIdP = requestMethod(provider, "eth_chainId").catch((err) => {
                throw Error(`Error while requesting chainId from provider: ${err}`);
            });
            const networkPkAbi = new ethers_1.Interface(["function getNetworkPublicKey()"]);
            const callData = networkPkAbi.encodeFunctionData("getNetworkPublicKey");
            const callParams = [{ to: consts_1.FheOpsAddress, data: callData }, "latest"];
            const publicKeyP = requestMethod(provider, "eth_call", callParams).catch((err) => {
                throw Error(`Error while requesting network public key from provider: ${JSON.stringify(err)}`);
            });
            const [chainId, publicKey] = yield Promise.all([chainIdP, publicKeyP]);
            const chainIdNum = parseInt(chainId, 16);
            if (isNaN(chainIdNum)) {
                throw new Error(`received non-hex number from chainId request: "${chainId}"`);
            }
            if (typeof publicKey !== "string") {
                throw new Error("Error using publicKey from provider: expected string");
            }
            const abiCoder = ethers_1.AbiCoder.defaultAbiCoder();
            const publicKeyDecoded = abiCoder.decode(["bytes"], publicKey)[0];
            const buff = (0, utils_1.fromHexString)(publicKeyDecoded);
            try {
                return node_tfhe_1.TfheCompactPublicKey.deserialize(buff);
            }
            catch (err) {
                throw new Error(`Error deserializing public key: did you initialize fhenix.js with "initFhevm()"? ${err}`);
            }
        });
    }
}
exports.FhenixClient = FhenixClient;
//# sourceMappingURL=index.js.map