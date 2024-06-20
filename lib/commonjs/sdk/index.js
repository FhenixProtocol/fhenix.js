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
const fhe_js_1 = require("./fhe/fhe.js");
const utils_js_1 = require("./utils.js");
const types_js_1 = require("./types.js");
const index_js_1 = require("../extensions/access_control/index.js");
const consts_js_1 = require("./consts.js");
const tfheEncrypt = __importStar(require("./encrypt.js"));
const validation_js_1 = require("./validation.js");
const init_js_1 = require("./init.js");
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
        (0, validation_js_1.isPlainObject)(params);
        // if (params?.provider === undefined) {
        //   params.provider = new JsonRpcProvider("http://localhost:42069");
        // }
        const { provider, ignoreErrors } = params;
        this.provider = provider;
        if (!this.provider) {
            throw new Error("Failed to initialize Fhenix Client - must include a web3 provider");
        }
        this.fhePublicKey = (0, init_js_1.GetFhePublicKey)(FhenixClient.getFheKeyFromProvider, provider).catch((err) => {
            if (ignoreErrors) {
                return undefined;
            }
            else {
                throw new Error(`Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`);
            }
        });
    }
    // Encryption Methods
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @returns {EncryptedBool} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    encrypt_bool(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const fhePublicKey = yield this._getPublicKey();
            return tfheEncrypt.encrypt_bool(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @returns {EncryptedUint8} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    encrypt_uint8(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey();
            (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT8, 0);
            return tfheEncrypt.encrypt_uint8(value, fhePublicKey);
        });
    }
    _getPublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            let fhePublicKey = yield this.fhePublicKey;
            if (!fhePublicKey) {
                // try again to get the public key - maybe the 1st time the chain wasn't up or something
                this.fhePublicKey = FhenixClient.getFheKeyFromProvider(this.provider);
                fhePublicKey = yield this.fhePublicKey;
                if (!fhePublicKey) {
                    throw new Error("Public key somehow not initialized");
                }
            }
            return fhePublicKey;
        });
    }
    /**
     * Encrypts a Uint16 value using the stored public key.
     * @param {number} value - The Uint16 value to encrypt.
     * @returns {EncryptedUint16} - The encrypted value serialized as EncryptedUint16. Use the .data property to access the Uint8Array.
     */
    encrypt_uint16(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey();
            (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT16, 0);
            return tfheEncrypt.encrypt_uint16(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a Uint32 value using the stored public key.
     * @param {number} value - The Uint32 value to encrypt.
     * @returns {EncryptedUint32} - The encrypted value serialized as EncryptedUint32. Use the .data property to access the Uint8Array.
     */
    encrypt_uint32(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey();
            (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT32, 0);
            return tfheEncrypt.encrypt_uint32(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a Uint64 value using the stored public key.
     * @param {bigint | string} value - The Uint32 value to encrypt.
     * @returns {EncryptedUint64} - The encrypted value serialized as EncryptedUint64. Use the .data property to access the Uint8Array.
     */
    encrypt_uint64(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey();
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint64(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a Uint128 value using the stored public key.
     * @param {bigint | string} value - The Uint128 value to encrypt.
     * @returns {EncryptedUint128} - The encrypted value serialized as EncryptedUint128. Use the .data property to access the Uint8Array.
     */
    encrypt_uint128(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey();
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint128(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a Uint256 value using the stored public key.
     * @param {bigint | string} value - The Uint256 value to encrypt.
     * @returns {EncryptedUint256} - The encrypted value serialized as EncryptedUint256. Use the .data property to access the Uint8Array.
     */
    encrypt_uint256(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey();
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint256(value, fhePublicKey);
        });
    }
    /**
     * Encrypts an Address (Uint160) value using the stored public key.
     * @param {bigint | string} value - The Address (Uint160) value to encrypt.
     * @returns {EncryptedAddress} - The encrypted value serialized as EncryptedAddress. Use the .data property to access the Uint8Array.
     */
    encrypt_address(value) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey();
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_address(value, fhePublicKey);
        });
    }
    /**
     * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
     * @param {number} value - The numeric value to encrypt.
     * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
     * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
     */
    encrypt(value, type) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isNumber)(value);
            let outputSize = type;
            const fhePublicKey = yield this.fhePublicKey;
            if (!fhePublicKey) {
                throw new Error("Public key somehow not initialized");
            }
            // choose the most efficient ciphertext size if not selected
            if (!outputSize) {
                if (value < consts_js_1.MAX_UINT8) {
                    outputSize = types_js_1.EncryptionTypes.uint8;
                }
                else if (value < consts_js_1.MAX_UINT16) {
                    outputSize = types_js_1.EncryptionTypes.uint16;
                }
                else if (value < consts_js_1.MAX_UINT32) {
                    outputSize = types_js_1.EncryptionTypes.uint32;
                }
                else {
                    throw new Error(`Encryption input must be smaller than ${consts_js_1.MAX_UINT32}`);
                }
            }
            switch (outputSize) {
                case types_js_1.EncryptionTypes.uint8:
                    (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT8, 0);
                    break;
                case types_js_1.EncryptionTypes.uint16:
                    (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT16, 0);
                    break;
                case types_js_1.EncryptionTypes.uint32:
                    (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT32, 0);
                    break;
                default:
            }
            return tfheEncrypt.encrypt(value, fhePublicKey, type);
        });
    }
    // Unsealing Method
    /**
     * Unseals an encrypted message using the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} ciphertext - The encrypted message to unseal.
     * @returns bigint - The unsealed message.
     */
    unseal(contractAddress, ciphertext) {
        (0, utils_js_1.isAddress)(contractAddress);
        (0, validation_js_1.isString)(ciphertext);
        if (!this.hasPermit(contractAddress)) {
            throw new Error(`Missing keypair for ${contractAddress}`);
        }
        return this.permits[contractAddress].sealingKey.unseal(ciphertext);
    }
    // Permit Management Methods
    /**
     * Creates a new permit for a specific contract address. Also saves the permit to localstorage (if available)
     * @param {string} contractAddress - The address of the contract.
     * @param {SupportedProvider} provider - The provider from which to sign the permit - must container a signer.
     * @param signer - the signer to use to sign the permit if provider does not support signing (e.g. hardhat)
     * @returns Permit - The permit associated with the contract address.
     *
     * @throws {Error} - If the provider does not contain a signer, or if a provider is not set
     */
    generatePermit(contractAddress, provider, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!provider && this.provider === undefined) {
                throw new Error("error getting provider");
            }
            const permit = yield (0, index_js_1.generatePermit)(contractAddress, provider || this.provider, signer);
            this.storePermit(permit);
            return permit;
        });
    }
    /**
     * Retrieves the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The address of the user account.
     * @returns {Permit} - The permit associated with the contract address.
     */
    getPermit(contractAddress, account) {
        const fromLs = (0, index_js_1.getPermitFromLocalstorage)(contractAddress, account);
        if (fromLs) {
            this.permits[contractAddress] = fromLs;
            return fromLs;
        }
        if (!this.hasPermit(contractAddress)) {
            return undefined;
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
            const requestMethod = (0, types_js_1.determineRequestMethod)(provider);
            const chainIdP = requestMethod(provider, "eth_chainId").catch((err) => {
                throw Error(`Error while requesting chainId from provider: ${err}`);
            });
            // const networkPkAbi = new Interface(["function getNetworkPublicKey()"]);
            // const callData = networkPkAbi.encodeFunctionData("getNetworkPublicKey");
            // todo: use this to remove ethers dependency
            const callData = "0x44e21dd2";
            // console.log(`calldata: ${callData}`);
            const callParams = [{ to: consts_js_1.FheOpsAddress, data: callData }, "latest"];
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
            if (publicKey.length < consts_js_1.PUBLIC_KEY_LENGTH_MIN) {
                throw new Error(`Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`);
            }
            // magically know how to decode rlp or w/e returns from the evm json-rpc
            const buff = (0, utils_js_1.fromHexString)(publicKey.slice(130));
            try {
                return fhe_js_1.TfheCompactPublicKey.deserialize(buff);
            }
            catch (err) {
                throw new Error(`Error deserializing public key ${err}`);
            }
        });
    }
}
exports.FhenixClient = FhenixClient;
//# sourceMappingURL=index.js.map