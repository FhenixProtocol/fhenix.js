import { beforeAll, describe, expect, it } from "vitest";
import {
  FhenixClient,
  GenerateSealingKey,
  getPermit,
  Permit,
  SealingKey,
} from "../src";
import { createTfhePublicKey } from "../src/sdk/tfhe/tfhe";
import { MockProvider } from "./utils";

// @ts-ignore
const localStorageMock: Storage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string): string | null {
      return Object.prototype.hasOwnProperty.call(store, key)
        ? store[key]
        : null;
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
    },
  };
})();

// Assign the localStorage mock to global scope if window is not defined
// @ts-ignore
if (typeof window === "undefined") {
  (global as any).window = {};
  (global as any).window.localStorage = localStorageMock;
}

describe.skip("Permit Tests", () => {
  let tfhePublicKey: string;
  const contractAddress = "0x1c786b8ca49D932AFaDCEc00827352B503edf16c";

  beforeAll(async () => {
    tfhePublicKey = createTfhePublicKey();
    localStorageMock.clear();
  });

  it("creates an instance", async () => {
    const provider = new MockProvider(tfhePublicKey);
    const instance = new FhenixClient({ provider, initSdk: false });
  });

  it("creates an instance with a permit", async () => {
    const keypair = await GenerateSealingKey();

    const permit: Permit = {
      contractAddress,
      publicKey: keypair.publicKey,
      sealingKey: keypair,
      signature: "",
    };

    const instance = new FhenixClient({
      provider: new MockProvider(tfhePublicKey),
      initSdk: false,
    });

    instance.storePermit(permit);

    const value = 937387;
    const ciphertext = SealingKey.seal(value, keypair.publicKey);

    const cleartext = instance.unseal(contractAddress, ciphertext);
    expect(cleartext).toBe(BigInt(value));
  });

  it("try to load permit without auto generating a new one", async () => {
    const provider = new MockProvider(tfhePublicKey);

    const permit = await getPermit(contractAddress, provider, false);
    expect(permit).toBe(null);
  });

  it("generates a permit and loads it to the instance", async () => {
    const provider = new MockProvider(tfhePublicKey);
    await expect(getPermit(undefined as any, provider)).rejects.toThrow(
      "Address undefined is not valid EVM address",
    );
    await expect(
      getPermit(contractAddress.slice(0, 10), provider),
    ).rejects.toThrow("Address 0x1c786b8c is not valid EVM address");
    await expect(getPermit(contractAddress, undefined as any)).rejects.toThrow(
      "Missing provider",
    );

    const permit = await getPermit(contractAddress, provider);
    expect(permit.contractAddress).toBe(contractAddress);
    expect(permit.signature).toBe("0x123");

    const instance = new FhenixClient({
      provider: new MockProvider(tfhePublicKey),
      initSdk: false,
    });

    instance.storePermit(permit);
    expect(instance.hasPermit(contractAddress)).toBeTruthy();
  });

  it("returns a saved permit from localStorage", async () => {
    const provider = new MockProvider(tfhePublicKey);
    const permit = await getPermit(contractAddress, provider);

    const savedPermit = await getPermit(contractAddress, provider);
    expect(JSON.stringify(savedPermit)).toEqual(JSON.stringify(permit));
  });

  it("decrypts data using the sealing key from the permit", async () => {
    const provider = new MockProvider(tfhePublicKey);

    const instance = new FhenixClient({
      provider: new MockProvider(tfhePublicKey),
      initSdk: false,
    });

    const permit = await getPermit(contractAddress, provider);

    instance.storePermit(permit);

    const value = 89290;
    const ciphertext = SealingKey.seal(value, permit.publicKey);
    const cleartext = permit.sealingKey.unseal(ciphertext);
    expect(cleartext).toBe(BigInt(value));
  });
});
