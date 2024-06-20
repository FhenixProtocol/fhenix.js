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
exports.GenerateSealingKey = exports.SealingKey = void 0;
const utils_js_1 = require("./utils.js");
const nacl = __importStar(require("tweetnacl"));
const naclUtil = __importStar(require("tweetnacl-util"));
const validation_js_1 = require("./validation.js");
const PRIVATE_KEY_LENGTH = 64;
const PUBLIC_KEY_LENGTH = 64;
/**
 * A class representing a SealingKey which provides cryptographic sealing (encryption)
 * and unsealing (decryption) capabilities.
 */
class SealingKey {
    /**
     * Constructs a SealingKey instance with the given private and public keys.
     *
     * @param {string} privateKey - The private key used for decryption.
     * @param {string} publicKey - The public key used for encryption.
     * @throws Will throw an error if the provided keys lengths do not match
     *         the required lengths for private and public keys.
     */
    constructor(privateKey, publicKey) {
        /**
         * Unseals (decrypts) the provided ciphertext using the instance's private key.
         *
         * @param {string | Uint8Array} ciphertext - The encrypted data to be decrypted.
         * @returns BigInt - The decrypted message as a bigint.
         * @throws Will throw an error if the decryption process fails.
         */
        this.unseal = (ciphertext) => {
            let parsedData = undefined;
            try {
                if (typeof ciphertext === "string") {
                    parsedData = JSON.parse(ciphertext);
                }
            }
            catch (_a) {
                // ignore errors
            }
            if (!parsedData) {
                const toDecrypt = typeof ciphertext === "string" ? (0, utils_js_1.fromHexString)(ciphertext) : ciphertext;
                // decode json structure that gets returned from the chain
                const jsonString = Buffer.from(toDecrypt).toString("utf8");
                parsedData = JSON.parse(jsonString);
            }
            if (!parsedData) {
                throw new Error("Failed to parse sealed data");
            }
            // assemble decryption parameters
            const nonce = naclUtil.decodeBase64(parsedData.nonce);
            const ephemPublicKey = naclUtil.decodeBase64(parsedData.ephemPublicKey);
            const dataToDecrypt = naclUtil.decodeBase64(parsedData.ciphertext);
            // call the nacl box function to decrypt the data
            const decryptedMessage = nacl.box.open(dataToDecrypt, nonce, ephemPublicKey, (0, utils_js_1.fromHexString)(this.privateKey));
            if (!decryptedMessage) {
                throw new Error("Failed to decrypt message");
            }
            return (0, utils_js_1.toBigInt)(decryptedMessage);
        };
        if (privateKey.length !== PRIVATE_KEY_LENGTH) {
            throw new Error(`Private key must be of length ${PRIVATE_KEY_LENGTH}`);
        }
        if (publicKey.length !== PUBLIC_KEY_LENGTH) {
            throw new Error(`Private key must be of length ${PUBLIC_KEY_LENGTH}`);
        }
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
}
exports.SealingKey = SealingKey;
/**
 * Seals (encrypts) the provided message for a receiver with the specified public key.
 *
 * @param {bigint | number} value - The message to be encrypted.
 * @param {string} publicKey - The public key of the intended recipient.
 * @returns string - The encrypted message in hexadecimal format.
 * @static
 * @throws Will throw if the provided publicKey or value do not meet defined preconditions.
 */
SealingKey.seal = (value, publicKey) => {
    (0, validation_js_1.isString)(publicKey);
    (0, validation_js_1.isBigIntOrNumber)(value);
    // generate ephemeral keypair
    const ephemeralKeyPair = nacl.box.keyPair();
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const encryptedMessage = nacl.box((0, utils_js_1.toBeArray)(value), nonce, (0, utils_js_1.fromHexString)(publicKey), ephemeralKeyPair.secretKey);
    // handle encrypted data
    const output = {
        version: "x25519-xsalsa20-poly1305",
        nonce: naclUtil.encodeBase64(nonce),
        ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
        ciphertext: naclUtil.encodeBase64(encryptedMessage),
    };
    // mimicking encoding from the chain
    return (0, utils_js_1.toHexString)(Buffer.from(JSON.stringify(output)));
};
/**
 * Asynchronously generates a new SealingKey.
 * This function uses the 'nacl' library to create a new public/private key pair for sealing purposes.
 * A sealing key is used to encrypt data such that it can only be unsealed (decrypted) by the owner of the corresponding private key.
 * @returns {Promise<SealingKey>} - A promise that resolves to a new SealingKey object containing the hexadecimal strings of the public and private keys.
 */
const GenerateSealingKey = () => __awaiter(void 0, void 0, void 0, function* () {
    const sodiumKeypair = nacl.box.keyPair();
    return new SealingKey((0, utils_js_1.toHexString)(sodiumKeypair.secretKey), (0, utils_js_1.toHexString)(sodiumKeypair.publicKey));
});
exports.GenerateSealingKey = GenerateSealingKey;
//# sourceMappingURL=sealing.js.map