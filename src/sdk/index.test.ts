import sodium from 'libsodium-wrappers';
import { createInstance } from './index';
import { createTfhePublicKey } from '../tfhe';
import { fromHexString, toHexString, numberToBytes } from '../utils';
import { JsonRpcProvider } from "ethers";

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
      } else if (method === 'eth_getNetworkPublicKey') {
        resolve(this.publicKey);
      } else {
        reject('method not implemented');
      }
    });
  }
}

describe('token', () => {
  let tfhePublicKey: string;

  beforeAll(async () => {
    await sodium.ready;
    tfhePublicKey = createTfhePublicKey();
  });

  it('creates an instance', async () => {
    const provider = new MockProvider(tfhePublicKey);
    const instance = await createInstance({provider});
    expect(instance.encrypt_uint8).toBeDefined();
    expect(instance.encrypt_uint16).toBeDefined();
    expect(instance.encrypt_uint32).toBeDefined();
    expect(instance.generateToken).toBeDefined();
    expect(instance.unseal).toBeDefined();
    expect(instance.serializeKeypairs).toBeDefined();
    expect(instance.getTokenSignature).toBeDefined();
    expect(instance.hasKeypair).toBeDefined();
  });

  it('creates an instance with ethers provider - unreachable endpoint', async () => {
    const provider = new JsonRpcProvider('http://localhost:1234');

    await expect(
      createInstance({provider}),
    ).rejects.toThrow('Error while requesting chainId from provider: Error: connect ECONNREFUSED 127.0.0.1:1234');

    // prevent endless fetching
    await provider.destroy();
  });

  it('creates an instance with window.ethereum provider - unreachable endpoint', async () => {
    const provider = new JsonRpcProvider('http://localhost:1234');

    await expect(
      createInstance({provider}),
    ).rejects.toThrow('Error while requesting chainId from provider: Error: connect ECONNREFUSED 127.0.0.1:1234');

    // prevent endless fetching
    await provider.destroy();
  });

  it('creates an unsupported provider', async () => {
    const provider = new JsonRpcProvider('http://localhost:1234');

    // destroy send method
    Object.assign(provider, { send: undefined } );

    await expect(
      createInstance({provider}),
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

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

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

  it('controls generateToken', async () => {
    const instance = await createInstance({
      provider: new MockProvider(tfhePublicKey),
    });
    expect(() => instance.generateToken(undefined as any)).toThrow(
      'Missing contract address',
    );
    expect(() => instance.generateToken({ verifyingContract: '' })).toThrow(
      'Missing contract address',
    );
    expect(() =>
      instance.generateToken({ verifyingContract: '0x847473829d' }),
    ).toThrow('Invalid contract address');
  });

  it('save generated token', async () => {
    const instance = await createInstance({
      provider: new MockProvider(tfhePublicKey),
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { token, publicKey } = instance.generateToken({
      verifyingContract: contractAddress,
    });

    instance.setTokenSignature(contractAddress, 'signnnn');

    expect(instance.hasKeypair(contractAddress)).toBeTruthy();

    const kp = instance.getTokenSignature(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);
  });

  it("don't export keys without signature", async () => {
    const instance = await createInstance({
      provider: new MockProvider(tfhePublicKey),
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { token, publicKey } = instance.generateToken({
      verifyingContract: contractAddress,
    });
    const keypairs = instance.serializeKeypairs();
    expect(keypairs[contractAddress]).toBeUndefined();
    const keypair = instance.getTokenSignature(contractAddress);
    expect(keypair).toBeNull();
    expect(instance.hasKeypair(contractAddress)).toBeFalsy();
  });

  it('decrypts data', async () => {
    const instance = await createInstance({
      provider: new MockProvider(tfhePublicKey),
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { token, publicKey } = instance.generateToken({
      verifyingContract: contractAddress,
    });

    instance.setTokenSignature(contractAddress, 'signnnn');

    const kp = instance.getTokenSignature(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);

    const value = 89290;
    const ciphertext = sodium.crypto_box_seal(
      numberToBytes(value),
      publicKey,
      'hex',
    );
    const cleartext = instance.unseal(contractAddress, ciphertext);
    expect(cleartext).toBe(value);
  });
});
