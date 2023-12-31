import { fromHexString, numberToBytes, toBeArray, toBigInt, toHexString } from './utils';
import is, { assert } from '@sindresorhus/is';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

const PRIVATE_KEY_LENGTH = 64;
const PUBLIC_KEY_LENGTH = 64;

export type EthEncryptedData = {
  version: string;
  nonce: string;
  ephemPublicKey: string;
  ciphertext: string;
};

export class SealingKey {
  privateKey: string;
  publicKey: string;

  constructor(privateKey: string, publicKey: string) {

    if (privateKey.length !== PRIVATE_KEY_LENGTH) {
      throw new Error(`Private key must be of length ${PRIVATE_KEY_LENGTH}`);
    }

    if (publicKey.length !== PUBLIC_KEY_LENGTH) {
      throw new Error(`Private key must be of length ${PUBLIC_KEY_LENGTH}`);
    }

    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  unseal = (ciphertext: string | Uint8Array): bigint => {
    const toDecrypt =
      typeof ciphertext === 'string' ? fromHexString(ciphertext) : ciphertext;

    // json decoding
    const jsonString =Buffer.from(toDecrypt).toString('utf8')
    const parsedData: EthEncryptedData = JSON.parse(jsonString)

    // assemble decryption parameters
    const nonce = naclUtil.decodeBase64(parsedData.nonce);
    const ephemPublicKey = naclUtil.decodeBase64(
      parsedData.ephemPublicKey,
    );
    const dataToDecrypt = naclUtil.decodeBase64(
      parsedData.ciphertext,
    );
    // decrypt
    const decryptedMessage = nacl.box.open(
      dataToDecrypt,
      nonce,
      ephemPublicKey,
      fromHexString(this.privateKey),
    );

    if (!decryptedMessage) {
      throw new Error("Failed to decrypt message");
    }

    return toBigInt(decryptedMessage);
  };

  static seal = (value: bigint | number, publicKey: string): string => {
    assert.string(publicKey);
    assert.any([is.bigint, is.number], value)

    // generate ephemeral keypair
    const ephemeralKeyPair = nacl.box.keyPair();

    // assemble encryption parameters - from string to UInt8
    let pubKeyUInt8Array: Uint8Array;
    try {
      pubKeyUInt8Array = naclUtil.decodeBase64(publicKey);
    } catch (err) {
      throw new Error('Bad public key');
    }

    const nonce = nacl.randomBytes(nacl.box.nonceLength);

    const encryptedMessage = nacl.box(
      toBeArray(value),
      nonce,
      fromHexString(publicKey),
      ephemeralKeyPair.secretKey,
    );

    // handle encrypted data
    const output = {
      version: 'x25519-xsalsa20-poly1305',
      nonce: naclUtil.encodeBase64(nonce),
      ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
      ciphertext: naclUtil.encodeBase64(encryptedMessage),
    };

    // mimicking encoding from the chain
    return toHexString(Buffer.from(JSON.stringify(output)))
  }

}

export const GenerateSealingKey = async (): Promise<SealingKey> => {
  const sodiumKeypair = nacl.box.keyPair();

  return new SealingKey(
    toHexString(sodiumKeypair.secretKey), toHexString(sodiumKeypair.publicKey));
}
