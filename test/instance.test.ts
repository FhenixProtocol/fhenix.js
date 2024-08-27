/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonRpcProvider } from "ethers";
import { beforeAll, describe, expect, it } from "vitest";
import {
  FhenixClient,
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

  beforeAll(async () => {
    tfhePublicKey = createTfhePublicKey();
  });

  it("creates an instance", async () => {
    const provider = new MockProvider(tfhePublicKey);
    const instance = await FhenixClient.create({ provider });
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
  });

  it("creates an instance with ethers provider - unreachable endpoint", async () => {
    const provider = new JsonRpcProvider("http://localhost:1234") as any;
    // prevent endless fetching
    await provider.on("error", (_) => provider.destroy());

    await expect(await FhenixClient.create({ provider })).rejects.toThrow(
      /.*Error while requesting chainId from provider.*/i,
    );
  });

  it("creates an unsupported provider", async () => {
    const provider = new JsonRpcProvider("http://localhost:1234") as any;
    // prevent endless fetching
    await provider.on("error", (_) => provider.destroy());

    // destroy send method
    Object.assign(provider, { send: undefined });

    await expect(await FhenixClient.create({ provider })).rejects.toThrow(
      "Received unsupported provider. 'send' or 'request' method not found",
    );
  });

  it("fails to create an instance", async () => {
    await expect(
      await FhenixClient.create({
        provider: new MockProvider(tfhePublicKey, "not a number"),
      }),
    ).rejects.toThrow(
      `received non-hex number from chainId request: "not a number"`,
    );

    const secondProvider = new MockProvider(BigInt(10));
    await expect(
      FhenixClient.create({ provider: secondProvider }),
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

    const instance = await FhenixClient.create({
      provider: new MockProvider(tfhePublicKey),
    });

    instance.storePermit(permit);

    const ciphertext = SealingKey.seal(value, keypair.publicKey);

    const cleartext = instance.unseal(contractAddress, ciphertext);
    expect(cleartext).toBe(BigInt(value));
  });

  it("checks that encrypting a malformed input throws the correct error", async () => {
    const instance = await FhenixClient.create({
      provider: new MockProvider(tfhePublicKey),
    });

    expect(() => instance.encrypt_uint8(undefined as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() => instance.encrypt_uint16(undefined as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() => instance.encrypt_uint32(undefined as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );
    expect(() => instance.encrypt_uint64(undefined as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instance.encrypt_uint128(undefined as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instance.encrypt_uint256(undefined as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instance.encrypt_address(undefined as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `undefined`.",
    );
    expect(() => instance.encrypt(undefined as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `undefined`.",
    );

    expect(() => instance.encrypt_uint8("wrong value" as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() => instance.encrypt_uint16("wrong value" as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() => instance.encrypt_uint32("wrong value" as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
    expect(() => instance.encrypt_uint64(222 as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instance.encrypt_uint128(222 as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instance.encrypt_uint256(222 as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instance.encrypt_address(222 as any)).rejects.toThrow(
      "Expected value which is `bigint or hex string`, received value of type `number`.",
    );
    expect(() => instance.encrypt("wrong value" as any)).rejects.toThrow(
      "Expected value which is `number`, received value of type `string`.",
    );
  });

  it("check that a permit gets generated, loaded to the instance and can unseal data for a specific contract", async () => {
    const provider = new MockProvider(tfhePublicKey);
    const value = 100;

    const instance = await FhenixClient.create({
      provider: new MockProvider(tfhePublicKey),
    });

    const permit = await getPermit(contractAddress, provider);

    const sealed = SealingKey.seal(value, permit!.sealingKey.publicKey);

    instance.storePermit(permit!);

    const cleartext = instance.unseal(contractAddress, sealed);
    expect(cleartext).toBe(BigInt(value));
  });

  it("checks that a permit will not decrypt data for a different contract", async () => {
    const provider = new MockProvider(tfhePublicKey);
    const value = 100;

    const instance = await FhenixClient.create({
      provider: new MockProvider(tfhePublicKey),
    });

    const permit = await getPermit(contractAddress, provider);

    const sealed = SealingKey.seal(value, permit!.sealingKey.publicKey);

    instance.storePermit(permit!);

    expect(() =>
      instance.unseal("0x000000000000000000000000000", sealed),
    ).toThrow(/Address 0x000000000000000000000000000 is not valid EVM address/);
  });

  it("Checks with a real chain that we can create an instance and use it", async () => {
    const provider = new JsonRpcProvider("http://localhost:8545") as any;

    const instance = await FhenixClient.create({
      provider,
    });

    await instance.encrypt(10, undefined, 0);
  });

  it("encrypt with instance on second security zone", async () => {
    const provider = new JsonRpcProvider("http://localhost:8545") as any;

    const instance = await FhenixClient.create({
      provider,
    });

    await instance.encrypt(11, undefined, 1);
  });
});
