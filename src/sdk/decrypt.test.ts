import sodium from 'libsodium-wrappers';
import { unseal } from './decrypt';
import { numberToBytes, toHexString } from '../utils';

describe('decrypt', () => {
  beforeAll(async () => {
    await sodium.ready;
  });

  it('decrypts a hex value', async () => {
    const keypair = sodium.crypto_box_keypair();

    const value = 28482;
    const ciphertext = sodium.crypto_box_seal(
      numberToBytes(value),
      keypair.publicKey,
      'hex',
    );
    const cleartext = unseal(keypair, ciphertext);
    expect(cleartext).toBe(value);
  });

  it('decrypts a Uint8Array value', async () => {
    const keypair = sodium.crypto_box_keypair();

    const value = 10;
    const ciphertext = sodium.crypto_box_seal(
      numberToBytes(value),
      keypair.publicKey,
    );
    const cleartext = unseal(keypair, ciphertext);
    expect(cleartext).toBe(value);
  });
});
