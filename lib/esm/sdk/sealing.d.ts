export type EthEncryptedData = {
    version: string;
    nonce: string;
    ephemPublicKey: string;
    ciphertext: string;
};
/**
 * A class representing a SealingKey which provides cryptographic sealing (encryption)
 * and unsealing (decryption) capabilities.
 */
export declare class SealingKey {
    /**
     * The private key used for decryption.
     */
    privateKey: string;
    /**
     * The public key used for encryption.
     */
    publicKey: string;
    /**
     * Constructs a SealingKey instance with the given private and public keys.
     *
     * @param {string} privateKey - The private key used for decryption.
     * @param {string} publicKey - The public key used for encryption.
     * @throws Will throw an error if the provided keys lengths do not match
     *         the required lengths for private and public keys.
     */
    constructor(privateKey: string, publicKey: string);
    /**
     * Unseals (decrypts) the provided ciphertext using the instance's private key.
     *
     * @param {string | Uint8Array} ciphertext - The encrypted data to be decrypted.
     * @returns BigInt - The decrypted message as a bigint.
     * @throws Will throw an error if the decryption process fails.
     */
    unseal: (ciphertext: string | Uint8Array) => bigint;
    /**
     * Seals (encrypts) the provided message for a receiver with the specified public key.
     *
     * @param {bigint | number} value - The message to be encrypted.
     * @param {string} publicKey - The public key of the intended recipient.
     * @returns string - The encrypted message in hexadecimal format.
     * @static
     * @throws Will throw if the provided publicKey or value do not meet defined preconditions.
     */
    static seal: (value: bigint | number, publicKey: string) => string;
}
/**
 * Asynchronously generates a new SealingKey.
 * This function uses the 'nacl' library to create a new public/private key pair for sealing purposes.
 * A sealing key is used to encrypt data such that it can only be unsealed (decrypted) by the owner of the corresponding private key.
 * @returns {Promise<SealingKey>} - A promise that resolves to a new SealingKey object containing the hexadecimal strings of the public and private keys.
 */
export declare const GenerateSealingKey: () => Promise<SealingKey>;
//# sourceMappingURL=sealing.d.ts.map