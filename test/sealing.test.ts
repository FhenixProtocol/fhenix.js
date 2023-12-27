import sodium from 'libsodium-wrappers';
import { GenerateSealingKey, SealingKey } from '../src/sdk/sealing';
import { fromHexString } from '../src/sdk/utils';

describe('tests sealing and unsealing using SealingKey', () => {
  beforeAll(async () => {
    await sodium.ready;
  });

  it('decrypts a hex value', async () => {
    const keypair = await GenerateSealingKey();

    const value = 28482;
    const ciphertext = SealingKey.seal(value, keypair.publicKey)
    const cleartext = keypair.unseal(ciphertext);
    expect(cleartext).toBe(BigInt(value));
  });

  it('decrypts a Uint8Array value', async () => {
    const keypair = await GenerateSealingKey();

    const value = 1;
    const ciphertext = SealingKey.seal(value, keypair.publicKey)
    const cleartext = keypair.unseal(fromHexString(ciphertext));
    expect(cleartext).toBe(BigInt(value));
  });
});