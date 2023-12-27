import sodium from 'libsodium-wrappers';
import { fromHexString, numberToBytes, toBeArray, toBigInt } from './utils';
import is, { assert } from '@sindresorhus/is';

const PRIVATE_KEY_LENGTH = 64;
const PUBLIC_KEY_LENGTH = 64;

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

    const decrypted = sodium.crypto_box_seal_open(
      toDecrypt,
      fromHexString(this.publicKey),
      fromHexString(this.privateKey),
    );
    return toBigInt(decrypted);
  };

  static seal = (value: bigint | number, publicKey: string): string => {
    assert.string(publicKey);
    assert.any([is.bigint, is.number], value)

    return sodium.crypto_box_seal(
      toBeArray(value),
      fromHexString(publicKey),
      'hex',
    );
  }

}

export const GenerateSealingKey = async (): Promise<SealingKey> => {
  await sodium.ready;

  const sodiumKeypair = sodium.crypto_box_keypair('hex');

  return new SealingKey(sodiumKeypair.privateKey, sodiumKeypair.publicKey);
}
