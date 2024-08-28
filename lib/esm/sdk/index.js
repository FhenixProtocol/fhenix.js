var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TfheCompactPublicKey } from "./fhe/fhe.js";
import { fromHexString, isAddress, ValidateUintInRange, toABIEncodedUint32, } from "./utils.js";
import { determineRequestMethod, EncryptionTypes, } from "./types.js";
import { generatePermit, getPermitFromLocalstorage, } from "../extensions/access_control/index.js";
import { FheOpsAddress, MAX_UINT16, MAX_UINT32, MAX_UINT8, PUBLIC_KEY_LENGTH_MIN, } from "./consts.js";
import * as tfheEncrypt from "./encrypt.js";
import { isBigIntOrHexString, isNumber, isPlainObject, isString, } from "./validation.js";
import { GetFhePublicKey } from "./init.js";
class FhenixClientBase {
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params) {
        this.permits = {};
        isPlainObject(params);
        const { provider } = params;
        this.provider = provider;
        if (!this.provider) {
            throw new Error("Failed to initialize Fhenix Client - must include a web3 provider");
        }
    }
    // Unsealing Method
    /**
     * Unseals an encrypted message using the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} ciphertext - The encrypted message to unseal.
     * @returns bigint - The unsealed message.
     */
    unseal(contractAddress, ciphertext) {
        isAddress(contractAddress);
        isString(ciphertext);
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
            const permit = yield generatePermit(contractAddress, provider || this.provider, signer);
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
        const fromLs = getPermitFromLocalstorage(contractAddress, account);
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
     * @param securityZone - The security zone for which to retrieve the key (default 0).
     * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
     */
    static getFheKeyFromProvider(provider_1) {
        return __awaiter(this, arguments, void 0, function* (provider, securityZone = 0) {
            const requestMethod = determineRequestMethod(provider);
            const chainIdP = requestMethod(provider, "eth_chainId").catch((err) => {
                throw Error(`Error while requesting chainId from provider: ${err}`);
            });
            const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
            const callData = funcSig + toABIEncodedUint32(securityZone);
            const callParams = [{ to: FheOpsAddress, data: callData }, "latest"];
            const publicKeyP = requestMethod(provider, "eth_call", callParams).catch((err) => {
                throw Error(`Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(err)}`);
            });
            const [chainId, publicKey] = yield Promise.all([chainIdP, publicKeyP]);
            const chainIdNum = parseInt(chainId, 16);
            if (isNaN(chainIdNum)) {
                throw new Error(`received non-hex number from chainId request: "${chainId}"`);
            }
            if (typeof publicKey !== "string") {
                throw new Error("Error using publicKey from provider: expected string");
            }
            if (publicKey.length < PUBLIC_KEY_LENGTH_MIN) {
                throw new Error(`Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`);
            }
            // todo (eshel) verify this
            // magically know how to decode rlp or w/e returns from the evm json-rpc
            const buff = fromHexString(publicKey.slice(130));
            try {
                return TfheCompactPublicKey.deserialize(buff);
            }
            catch (err) {
                throw new Error(`Error deserializing public key ${err}`);
            }
        });
    }
}
/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
export class FhenixClient extends FhenixClientBase {
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params) {
        super(params);
        this.defaultSecurityZone = 0;
        this.fhePublicKeys = [];
        // todo (eshel) probably add securityZone here?
        this.fhePublicKeys[this.defaultSecurityZone] = GetFhePublicKey(FhenixClientBase.getFheKeyFromProvider, params.provider).catch((err) => {
            if (params.ignoreErrors) {
                return undefined;
            }
            else {
                throw new Error(`Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`);
            }
        });
    }
    _getPublicKey(securityZone) {
        return __awaiter(this, void 0, void 0, function* () {
            let fhePublicKey = yield this.fhePublicKeys[securityZone];
            if (!fhePublicKey) {
                this.fhePublicKeys[securityZone] = FhenixClient.getFheKeyFromProvider(this.provider, securityZone);
                fhePublicKey = yield this.fhePublicKeys[securityZone];
                if (!fhePublicKey) {
                    throw new Error(`Public key for security zone ${securityZone} somehow not initialized`);
                }
            }
            return fhePublicKey;
        });
    }
    encrypt_bool(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            const fhePublicKey = yield this._getPublicKey(securityZone);
            return tfheEncrypt.encrypt_bool(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint8(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            isNumber(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            ValidateUintInRange(value, MAX_UINT8, 0);
            return tfheEncrypt.encrypt_uint8(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint16(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            isNumber(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            ValidateUintInRange(value, MAX_UINT16, 0);
            return tfheEncrypt.encrypt_uint16(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint32(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            isNumber(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            ValidateUintInRange(value, MAX_UINT32, 0);
            return tfheEncrypt.encrypt_uint32(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint64(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            isBigIntOrHexString(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint64(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint128(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            isBigIntOrHexString(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint128(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint256(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            isBigIntOrHexString(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint256(value, fhePublicKey, securityZone);
        });
    }
    encrypt_address(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            isBigIntOrHexString(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_address(value, fhePublicKey, securityZone);
        });
    }
    encrypt(value_1, type_1) {
        return __awaiter(this, arguments, void 0, function* (value, type, securityZone = 0) {
            isNumber(value);
            let outputSize = type;
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // choose the most efficient ciphertext size if not selected
            if (!outputSize) {
                if (value < MAX_UINT8) {
                    outputSize = EncryptionTypes.uint8;
                }
                else if (value < MAX_UINT16) {
                    outputSize = EncryptionTypes.uint16;
                }
                else if (value < MAX_UINT32) {
                    outputSize = EncryptionTypes.uint32;
                }
                else {
                    throw new Error(`Encryption input must be smaller than ${MAX_UINT32}`);
                }
            }
            switch (outputSize) {
                case EncryptionTypes.uint8:
                    ValidateUintInRange(value, MAX_UINT8, 0);
                    break;
                case EncryptionTypes.uint16:
                    ValidateUintInRange(value, MAX_UINT16, 0);
                    break;
                case EncryptionTypes.uint32:
                    ValidateUintInRange(value, MAX_UINT32, 0);
                    break;
                default:
            }
            return tfheEncrypt.encrypt(value, fhePublicKey, type, securityZone);
        });
    }
}
/**
 * The FhenixClientSync class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 *
 * The Sync FhenixClient allows the `client.encrypt_<xxxx>()` functions to be performed synchronously
 *
 * @Note The Sync FhenixClient must be created using `await FhenixClientSync.create({provider})` instead of `new FhenixClient({provider})`
 */
export class FhenixClientSync extends FhenixClientBase {
    constructor(params) {
        super(params);
        this.fhePublicKeys = [];
        this.fhePublicKeys = params.fhePublicKeys;
    }
    static create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            isPlainObject(params);
            const { provider, ignoreErrors } = params;
            if (!provider) {
                throw new Error("Failed to initialize Fhenix Client - must include a web3 provider");
            }
            const fhePublicKeys = [];
            const defaultSecurityZone = 0;
            fhePublicKeys[defaultSecurityZone] = yield GetFhePublicKey(FhenixClient.getFheKeyFromProvider, params.provider).catch((err) => {
                if (ignoreErrors) {
                    return undefined;
                }
                else {
                    throw new Error(`Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`);
                }
            });
            return new FhenixClientSync(Object.assign(Object.assign({}, params), { fhePublicKeys }));
        });
    }
    // Encryption Methods
    _getPublicKey(securityZone) {
        const fhePublicKey = this.fhePublicKeys[securityZone];
        if (!fhePublicKey) {
            if (!fhePublicKey) {
                throw new Error(`Public key for security zone ${securityZone} not initialized`);
            }
        }
        return fhePublicKey;
    }
    encrypt_bool(value, securityZone = 0) {
        const fhePublicKey = this._getPublicKey(securityZone);
        return tfheEncrypt.encrypt_bool(value, fhePublicKey, securityZone);
    }
    encrypt_uint8(value, securityZone = 0) {
        isNumber(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT8, 0);
        return tfheEncrypt.encrypt_uint8(value, fhePublicKey, securityZone);
    }
    encrypt_uint16(value, securityZone = 0) {
        isNumber(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT16, 0);
        return tfheEncrypt.encrypt_uint16(value, fhePublicKey, securityZone);
    }
    encrypt_uint32(value, securityZone = 0) {
        isNumber(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT32, 0);
        return tfheEncrypt.encrypt_uint32(value, fhePublicKey, securityZone);
    }
    encrypt_uint64(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint64(value, fhePublicKey, securityZone);
    }
    encrypt_uint128(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint128(value, fhePublicKey, securityZone);
    }
    encrypt_uint256(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint256(value, fhePublicKey, securityZone);
    }
    encrypt_address(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_address(value, fhePublicKey, securityZone);
    }
    encrypt(value, type, securityZone = 0) {
        isNumber(value);
        let outputSize = type;
        const fhePublicKey = this._getPublicKey(securityZone);
        // choose the most efficient ciphertext size if not selected
        if (!outputSize) {
            if (value < MAX_UINT8) {
                outputSize = EncryptionTypes.uint8;
            }
            else if (value < MAX_UINT16) {
                outputSize = EncryptionTypes.uint16;
            }
            else if (value < MAX_UINT32) {
                outputSize = EncryptionTypes.uint32;
            }
            else {
                throw new Error(`Encryption input must be smaller than ${MAX_UINT32}`);
            }
        }
        switch (outputSize) {
            case EncryptionTypes.uint8:
                ValidateUintInRange(value, MAX_UINT8, 0);
                break;
            case EncryptionTypes.uint16:
                ValidateUintInRange(value, MAX_UINT16, 0);
                break;
            case EncryptionTypes.uint32:
                ValidateUintInRange(value, MAX_UINT32, 0);
                break;
            default:
        }
        return tfheEncrypt.encrypt(value, fhePublicKey, type, securityZone);
    }
}
//# sourceMappingURL=index.js.map