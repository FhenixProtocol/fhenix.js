/**
 * @vitest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it } from "vitest";
import {
  FhenixClient,
  FhenixClientSync,
  GenerateSealingKey,
  getPermit,
  Permit,
  SealingKey,
} from "../lib/esm";
import { createTfhePublicKey } from "./keygen";
import { MockProvider } from "./utils";
import { afterEach } from "vitest";

describe("Permit Tests", () => {
  let tfhePublicKey: string;
  let provider: MockProvider;
  let signerAddress: string;
  const contractAddress = "0x1c786b8ca49D932AFaDCEc00827352B503edf16c";

  const createAsyncSyncInstancePair = async (provider: any) => {
    const instanceAsync = new FhenixClient({ provider });

    const instanceSync = await FhenixClientSync.create({ provider });

    return [
      { type: "Async", instance: instanceAsync },
      { type: "Sync", instance: instanceSync },
    ];
  };

  beforeAll(async () => {
    tfhePublicKey = createTfhePublicKey();
    provider = new MockProvider(tfhePublicKey);
    signerAddress = await (await provider.getSigner()).getAddress();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be in jsdom environment", async () => {
    expect(typeof window).not.toBe("undefined");
  });

  it("creates an instance", async () => {
    const instance = new FhenixClient({ provider });
    expect(instance).to.not.be.null;

    const instanceSync = await FhenixClientSync.create({ provider });
    expect(instanceSync).to.not.be.null;
  });

  it("creates an instance with a permit", async () => {
    const keypair = await GenerateSealingKey();

    const permit: Permit = {
      contractAddress,
      publicKey: keypair.publicKey,
      sealingKey: keypair,
      signature: "",
    };

    const instances = await createAsyncSyncInstancePair(provider);
    for (let i = 0; i < instances.length; i++) {
      const { type, instance } = instances[i];

      instance.storePermit(permit, signerAddress);

      const value = 937387;
      const ciphertext = SealingKey.seal(value, keypair.publicKey);

      const cleartext = instance.unseal(
        contractAddress,
        ciphertext,
        signerAddress,
      );
      expect(cleartext).toBe(BigInt(value));
    }
  });

  it("try to load permit without auto generating a new one", async () => {
    const permit = await getPermit(contractAddress, provider, false);
    expect(permit).toBe(null);
  });

  it("generates a permit and loads it to the instance", async () => {
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
    expect(permit!.contractAddress).toBe(contractAddress);
    expect(permit!.signature).toBe("0x123");

    const instances = await createAsyncSyncInstancePair(provider);
    for (let i = 0; i < instances.length; i++) {
      const { type, instance } = instances[i];

      instance.storePermit(permit!, signerAddress);
      expect(instance.hasPermit(contractAddress, signerAddress)).toBeTruthy();
    }
  });

  it("returns a saved permit from localStorage", async () => {
    const permit = await getPermit(contractAddress, provider);

    const savedPermit = await getPermit(contractAddress, provider);
    expect(JSON.stringify(savedPermit)).toEqual(JSON.stringify(permit));
  });

  it("decrypts data using the sealing key from the permit", async () => {
    const permit = await getPermit(contractAddress, provider);

    const instances = await createAsyncSyncInstancePair(provider);
    for (let i = 0; i < instances.length; i++) {
      const { type, instance } = instances[i];

      instance.storePermit(permit!, signerAddress);

      const value = 89290;
      const ciphertext = SealingKey.seal(value, permit!.publicKey);
      const cleartext = permit!.sealingKey.unseal(ciphertext);
      expect(cleartext).toBe(BigInt(value));
    }
  });
});
