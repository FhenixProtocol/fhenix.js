import sodium from 'libsodium-wrappers';
import { createInstance } from './index';
import { createTfhePublicKey } from '../tfhe';
import { fromHexString, toHexString, numberToBytes } from '../utils';
import { JsonRpcProvider, AbiCoder } from "ethers";
import { getPermit } from "../extensions/access_control/permit";

class MockSigner {
  async _signTypedData(domain: any, types: any, value: any): Promise<any> {
    return "0x123";
  }
}

class MockProvider {
  publicKey: any;
  chainId: any;

  constructor(pk: any, chainId?: any) {
    this.publicKey = pk;
    this.chainId = chainId || '0x10';
  }
  async send(method: string, params: any[] | Record<string, any>): Promise<any> {
    return new Promise((resolve, reject) => {
      if (method === 'eth_chainId') {
        resolve(this.chainId);
      } else if (method === 'eth_call') {
        //abi-encode public key as bytes:
        if (typeof this.publicKey === 'string') {
          const abiCoder = new AbiCoder();
          const buff = fromHexString(this.publicKey);
          const encoded = abiCoder.encode(['bytes'], [buff]);
          resolve(encoded);
        } else {
          resolve(this.publicKey);
        }
      } else {
        reject('method not implemented');
      }
    });
  }

  async getSigner(): Promise<MockSigner> {
    return new MockSigner();
  }
}

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
if (typeof window === 'undefined') {
  (global as any).window = {};
  (global as any).window.localStorage = localStorageMock;
}


describe('token', () => {
  let tfhePublicKey: string;
  const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';
  
  beforeAll(async () => {
    await sodium.ready;
    tfhePublicKey = createTfhePublicKey();
    localStorageMock.clear();

  });

  it('creates an instance', async () => {
    const provider = new MockProvider(tfhePublicKey);
    const instance = await createInstance({provider});
    expect(instance.encrypt_uint8).toBeDefined();
    expect(instance.encrypt_uint16).toBeDefined();
    expect(instance.encrypt_uint32).toBeDefined();
    expect(instance.unseal).toBeDefined();
    expect(instance.loadPermit).toBeDefined();    
    expect(instance.serializeKeypairs).toBeDefined();
    expect(instance.hasKeypair).toBeDefined();
  });

  it('creates an instance with ethers provider - unreachable endpoint', async () => {
    const provider = new JsonRpcProvider('http://localhost:1234');
    // prevent endless fetching
    await provider.on("error", (_) => provider.destroy());

    await expect(
      createInstance({provider})
    ).rejects.toThrow(/Error while requesting chainId from provider: Error: connect ECONNREFUSED .*:1234/);
  });

  it('creates an unsupported provider', async () => {
    const provider = new JsonRpcProvider('http://localhost:1234');
    // prevent endless fetching
    await provider.on("error", (_) => provider.destroy());

    // destroy send method
    Object.assign(provider, { send: undefined } );

    await expect(
      createInstance({provider})
    ).rejects.toThrow("Received unsupported provider. 'send' or 'request' method not found");
  });

  it('fails to create an instance', async () => {
    await expect(
      createInstance({provider: new MockProvider(tfhePublicKey, "not a number")}),
    ).rejects.toThrow(`received non-hex number from chainId request: "not a number"`);

    const secondProvider = new MockProvider(BigInt(10));
    await expect(
      createInstance({ provider: secondProvider }),
    ).rejects.toThrow('Error using publicKey from provider: expected string');
  });

  it('creates an instance with keypairs', async () => {
    const keypair = sodium.crypto_box_keypair('hex');

    const instance = await createInstance({
      provider: new MockProvider(tfhePublicKey),
      keypairs: {
        [contractAddress]: {
          privateKey: keypair.privateKey,
          publicKey: keypair.publicKey,
          signature: null,
        },
      },
    });

    const value = 937387;
    const ciphertext = sodium.crypto_box_seal(
      numberToBytes(value),
      fromHexString(keypair.publicKey),
      'hex',
    );

    const cleartext = instance.unseal(contractAddress, ciphertext);
    expect(cleartext).toBe(value);
  });

  it('controls encrypt', async () => {
    const instance = await createInstance({
      provider: new MockProvider(tfhePublicKey),
    });

    expect(() => instance.encrypt_uint8(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt_uint16(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt_uint32(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt(undefined as any)).toThrow('Missing value');


    expect(() => instance.encrypt_uint8('wrong value' as any)).toThrow(
      'Value must be a number',
    );
    expect(() => instance.encrypt_uint16('wrong value' as any)).toThrow(
      'Value must be a number',
    );
    expect(() => instance.encrypt_uint32('wrong value' as any)).toThrow(
      'Value must be a number',
    );
    expect(() => instance.encrypt('wrong value' as any)).toThrow(
      'Value must be a number',
    );
  });

  it('get permit', async () => {

    const provider = new MockProvider(tfhePublicKey);
    await expect(getPermit(undefined as any, provider)).rejects.toThrow(
      'Missing contract address',
    );
    await expect(getPermit(contractAddress.slice(0, 10), provider)).rejects.toThrow(
      'Invalid contract address'
    );
    await expect(getPermit(contractAddress, undefined as any)).rejects.toThrow(
      'Missing provider',
    );
    
    const permit = await getPermit(contractAddress, provider);
    expect(permit.contractAddress).toBe(contractAddress);
    expect(permit.keypair.signature).toBe("0x123");

    const instance = await createInstance({
      provider: new MockProvider(tfhePublicKey),
    });
    instance.loadPermit(permit);
    expect(instance.hasKeypair(contractAddress)).toBeTruthy();
  });

  it('returns a saved permit from localStorage', async () => {
    const provider = new MockProvider(tfhePublicKey);
    const permit = await getPermit(contractAddress, provider);

    // Mock a saved permit in localStorage
    localStorageMock.setItem(`Fhenix_saved_permit_${contractAddress}`, JSON.stringify(permit));

    const savedPermit = await getPermit(contractAddress, provider);
    expect(savedPermit).toEqual(permit);
  });
  


  it('decrypts data', async () => {
    const provider = new MockProvider(tfhePublicKey);

    const instance = await createInstance({
      provider: new MockProvider(tfhePublicKey),
    });

    const permit = await getPermit(contractAddress, provider);    

    instance.loadPermit(permit);

    const value = 89290;
    const ciphertext = sodium.crypto_box_seal(
      numberToBytes(value),
      permit.keypair.publicKey,
      'hex',
    );
    const cleartext = instance.unseal(contractAddress, ciphertext);
    expect(cleartext).toBe(value);
  });
});
