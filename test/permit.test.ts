import { createTfhePublicKey } from '../src/sdk/tfhe/tfhe';
import { MockProvider } from './utils';
import { FhenixClient, getPermit, SealingKey } from '../src';
import { fromHexString, numberToBytes } from '../src/sdk/utils';
import { GenerateSealingKey, Permit } from '../src';
import { assert, expect, test, describe, it, beforeAll } from 'vitest'

// @ts-ignore
const localStorageMock: Storage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string): string | null {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key: string, value: string): void {
      store[key] = value.toString();
    },
    removeItem(key: string): void {
      delete store[key];
    },
    clear(): void {
      store = {};
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key(index: number): string | null {
      const keys = Object.keys(store);
      return index < keys.length ? keys[index] : null;
    }
  };
})();

// Assign the localStorage mock to global scope if window is not defined
// @ts-ignore
if (typeof window === 'undefined') {
  (global as any).window = {};
  (global as any).window.localStorage = localStorageMock;
}

describe('Permit Tests', () => {
  let tfhePublicKey: string;
  const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

  beforeAll(async () => {
    tfhePublicKey = createTfhePublicKey();
    localStorageMock.clear();
  });

  it('creates an instance', async () => {
    const provider = new MockProvider(tfhePublicKey);
    const instance = await FhenixClient.Create({provider, initSdk: false});
  });

  it('creates an instance with a permit', async () => {
    const keypair = await GenerateSealingKey();

    const permit: Permit = {
      contractAddress, publicKey: keypair.publicKey, sealingKey: keypair, signature: ''
    }

    const instance = await FhenixClient.Create({
      provider: new MockProvider(tfhePublicKey),
      initSdk: false
    });

    instance.storePermit(permit);



    const value = 937387;
    const ciphertext = SealingKey.seal(
      value,
      keypair.publicKey,
    );

    const cleartext = instance.unseal(contractAddress, ciphertext);
    expect(cleartext).toBe(BigInt(value));
  });

  it('generates a permit and loads it to the instance', async () => {

    const provider = new MockProvider(tfhePublicKey);
    await expect(getPermit(undefined as any, provider)).rejects.toThrow(
      'Address undefined is not valid EVM address',
    );
    await expect(getPermit(contractAddress.slice(0, 10), provider)).rejects.toThrow(
      'Address 0x1c786b8c is not valid EVM address'
    );
    await expect(getPermit(contractAddress, undefined as any)).rejects.toThrow(
      'Missing provider',
    );

    const permit = await getPermit(contractAddress, provider);
    expect(permit.contractAddress).toBe(contractAddress);
    expect(permit.signature).toBe("0x123");

    const instance = await FhenixClient.Create({
      provider: new MockProvider(tfhePublicKey),
      initSdk: false
    });

    instance.storePermit(permit);
    expect(instance.hasPermit(contractAddress)).toBeTruthy();
  });

  it('returns a saved permit from localStorage', async () => {
    const provider = new MockProvider(tfhePublicKey);
    const permit = await getPermit(contractAddress, provider);

    const savedPermit = await getPermit(contractAddress, provider);
    expect(JSON.stringify(savedPermit)).toEqual(JSON.stringify(permit));
  });

  it('decrypts data using the sealing key from the permit', async () => {
    const provider = new MockProvider(tfhePublicKey);

    const instance = await FhenixClient.Create({
      provider: new MockProvider(tfhePublicKey),
      initSdk: false
    });

    const permit = await getPermit(contractAddress, provider);

    instance.storePermit(permit);

    const value = 89290;
    const ciphertext = SealingKey.seal(
      value,
      permit.publicKey,
    );
    const cleartext = permit.sealingKey.unseal(ciphertext);
    expect(cleartext).toBe(BigInt(value));
  });
});
