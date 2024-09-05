/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonRpcProvider } from "ethers";
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

describe("Instance", () => {
  let tfhePublicKey: string;
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
  });

  it("creates an instance", async () => {
    const instances = await createAsyncSyncInstancePair(
      new MockProvider(tfhePublicKey),
    );

    for (let i = 0; i < instances.length; i++) {
      const { type, instance } = instances[i];

      expect(instance.encrypt_bool).toBeDefined();
      expect(instance.encrypt_uint8).toBeDefined();
      expect(instance.encrypt_uint16).toBeDefined();
      expect(instance.encrypt_uint32).toBeDefined();
      expect(instance.encrypt_uint64).toBeDefined();
      expect(instance.encrypt_uint128).toBeDefined();
      expect(instance.encrypt_uint256).toBeDefined();
      expect(instance.encrypt_address).toBeDefined();
      expect(instance.unseal).toBeDefined();
      expect(instance.storePermit).toBeDefined();
      expect(instance.encrypt).toBeDefined();
      expect(instance.hasPermit).toBeDefined();
    }
  });

  it("creates an instance with ethers provider - unreachable endpoint", async () => {
    const provider = new JsonRpcProvider("http://localhost:1234") as any;
    // prevent endless fetching
    await provider.on("error", (_) => provider.destroy());

    await expect(
      new FhenixClient({ provider }).fhePublicKeys[0],
    ).rejects.toThrow(/.*Error while requesting chainId from provider.*/i);

    // SYNC

    const providerSync = new JsonRpcProvider("http://localhost:1234") as any;
    // prevent endless fetching
    await providerSync.on("error", (_) => providerSync.destroy());

    await expect(
      FhenixClientSync.create({ provider: providerSync }),
    ).rejects.toThrow(/.*Error while requesting chainId from provider.*/i);
  });

  it("creates an unsupported provider", async () => {
    const provider = new JsonRpcProvider("http://localhost:1234") as any;
    // prevent endless fetching
    await provider.on("error", (_) => provider.destroy());

    // destroy send method
    Object.assign(provider, { send: undefined });

    await expect(
      new FhenixClient({ provider }).fhePublicKeys[0],
    ).rejects.toThrow(
      "Received unsupported provider. 'send' or 'request' method not found",
    );

    // SYNC

    const providerSync = new JsonRpcProvider("http://localhost:1234") as any;
    // prevent endless fetching
    await providerSync.on("error", (_) => providerSync.destroy());

    // destroy send method
    Object.assign(providerSync, { send: undefined });

    await expect(
      FhenixClientSync.create({ provider: providerSync }),
    ).rejects.toThrow(
      "Received unsupported provider. 'send' or 'request' method not found",
    );
  });

  it("fails to create an instance", async () => {
    await expect(
      new FhenixClient({
        provider: new MockProvider(tfhePublicKey, "not a number"),
      }).fhePublicKeys[0],
    ).rejects.toThrow(
      `received non-hex number from chainId request: "not a number"`,
    );

    const secondProvider = new MockProvider(BigInt(10));
    await expect(
      new FhenixClient({ provider: secondProvider }).fhePublicKeys[0],
    ).rejects.toThrow("Error using publicKey from provider: expected string");

    // SYNC

    await expect(
      FhenixClientSync.create({
        provider: new MockProvider(tfhePublicKey, "not a number"),
      }),
    ).rejects.toThrow(
      `received non-hex number from chainId request: "not a number"`,
    );

    await expect(
      FhenixClientSync.create({ provider: secondProvider }),
    ).rejects.toThrow("Error using publicKey from provider: expected string");
  });

  it("creates an instance and uses it to unseal data", async () => {
    const keypair = await GenerateSealingKey();
    const value = 937387;

    const permit: Permit = {
      contractAddress,
      publicKey: keypair.publicKey,
      sealingKey: keypair,
      signature: "",
    };

    const provider = new MockProvider(tfhePublicKey);
    const signerAddress = await (await provider.getSigner()).getAddress();

    const instances = await createAsyncSyncInstancePair(provider);

    for (let i = 0; i < instances.length; i++) {
      const { type, instance } = instances[i];

      instance.storePermit(permit, signerAddress);

      const ciphertext = SealingKey.seal(value, keypair.publicKey);

      const cleartext = instance.unseal(
        contractAddress,
        ciphertext,
        signerAddress,
      );
      expect(cleartext).toBe(BigInt(value));
    }
  });

  it("checks that encrypting a malformed input throws the correct error", async () => {
    const provider = new MockProvider(tfhePublicKey);

    const instanceAsync = new FhenixClient({ provider });

    expect(() => instanceAsync.encrypt_uint8(undefined as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() => instanceAsync.encrypt_uint8(undefined as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() =>
      instanceAsync.encrypt_uint16(undefined as any),
    ).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() =>
      instanceAsync.encrypt_uint32(undefined as any),
    ).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() =>
      instanceAsync.encrypt_uint64(undefined as any),
    ).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() =>
      instanceAsync.encrypt_uint128(undefined as any),
    ).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() =>
      instanceAsync.encrypt_uint256(undefined as any),
    ).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() =>
      instanceAsync.encrypt_address(undefined as any),
    ).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instanceAsync.encrypt(undefined as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );

    expect(() =>
      instanceAsync.encrypt_uint8("wrong value" as any),
    ).rejects.toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() =>
      instanceAsync.encrypt_uint16("wrong value" as any),
    ).rejects.toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() =>
      instanceAsync.encrypt_uint32("wrong value" as any),
    ).rejects.toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() => instanceAsync.encrypt_uint64(222 as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instanceAsync.encrypt_uint128(222 as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instanceAsync.encrypt_uint256(222 as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instanceAsync.encrypt_address(222 as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instanceAsync.encrypt("wrong value" as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );

    // Sync

    const instanceSync = await FhenixClientSync.create({ provider });

    expect(() => instanceSync.encrypt_uint8(undefined as any)).toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() => instanceSync.encrypt_uint8(undefined as any)).toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() => instanceSync.encrypt_uint16(undefined as any)).toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() => instanceSync.encrypt_uint32(undefined as any)).toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() => instanceSync.encrypt_uint64(undefined as any)).toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instanceSync.encrypt_uint128(undefined as any)).toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instanceSync.encrypt_uint256(undefined as any)).toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instanceSync.encrypt_address(undefined as any)).toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instanceSync.encrypt(undefined as any)).toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );

    expect(() => instanceSync.encrypt_uint8("wrong value" as any)).toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() => instanceSync.encrypt_uint16("wrong value" as any)).toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() => instanceSync.encrypt_uint32("wrong value" as any)).toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() => instanceSync.encrypt_uint64(222 as any)).toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instanceSync.encrypt_uint128(222 as any)).toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instanceSync.encrypt_uint256(222 as any)).toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instanceSync.encrypt_address(222 as any)).toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instanceSync.encrypt("wrong value" as any)).toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
  });

  it("checks that encrypting an input succeeds", async () => {
    const provider = new MockProvider(tfhePublicKey);

    const instanceAsync = new FhenixClient({ provider });
    await instanceAsync.encrypt_bool(true);

    const instanceSync = await FhenixClientSync.create({ provider });
    instanceSync.encrypt_bool(true);
  });

  it("check that a permit gets generated, loaded to the instance and can unseal data for a specific contract", async () => {
    const provider = new MockProvider(tfhePublicKey);
    const signerAddress = await (await provider.getSigner()).getAddress();
    const value = 100;

    const instances = await createAsyncSyncInstancePair(provider);
    for (let i = 0; i < instances.length; i++) {
      const { type, instance } = instances[i];

      const permit = await getPermit(contractAddress, provider);

      const sealed = SealingKey.seal(value, permit!.sealingKey.publicKey);

      instance.storePermit(permit!, signerAddress);

      const cleartext = instance.unseal(contractAddress, sealed, signerAddress);
      expect(cleartext).toBe(BigInt(value));
    }
  });

  it("checks that a permit will not decrypt data for a different contract", async () => {
    const provider = new MockProvider(tfhePublicKey);
    const signerAddress = await (await provider.getSigner()).getAddress();
    const value = 100;

    const instances = await createAsyncSyncInstancePair(provider);
    for (let i = 0; i < instances.length; i++) {
      const { type, instance } = instances[i];

      const permit = await getPermit(contractAddress, provider);

      const sealed = SealingKey.seal(value, permit!.sealingKey.publicKey);

      instance.storePermit(permit!, signerAddress);

      expect(() =>
        instance.unseal("0x000000000000000000000000000", sealed, signerAddress),
      ).toThrow(
        /Address 0x000000000000000000000000000 is not valid EVM address/,
      );
    }
  });

  it("Checks with a real chain that we can create an instance and use it", async () => {
    const provider = new JsonRpcProvider("http://localhost:8545") as any;

    const instance = new FhenixClient({
      provider,
    });

    await instance.encrypt(10, undefined, 0);

    // SYNC

    const instanceSync = await FhenixClientSync.create({
      provider,
    });

    instanceSync.encrypt(10, undefined, 0);
  });

  it("sync fhenix client should revert on second uninitialized security zone", async () => {
    const provider = new JsonRpcProvider("http://localhost:8545") as any;

    const instanceSync = await FhenixClientSync.create({
      provider,
    });

    expect(() => instanceSync.encrypt(11, undefined, 1)).toThrow(
      "Public key for security zone 1 not initialized",
    );
  });

  it("encrypt with instance on second security zone", async () => {
    const provider = new JsonRpcProvider("http://localhost:8545") as any;

    const instance = new FhenixClient({
      provider,
    });

    await instance.encrypt(11, undefined, 1);

    // SYNC

    const instanceSync = await FhenixClientSync.create({
      provider,
      securityZones: [0, 1],
    });

    instanceSync.encrypt(11, undefined, 1);
  });
});
