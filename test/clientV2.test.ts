/**
 * @vitest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { createTfhePublicKey } from "./keygen";
import { MockProvider, MockSigner } from "./utils";
import { afterEach } from "vitest";
import { FhenixClientV2 } from "../src/sdk/clientV2";
import {
  Encryptable,
  EncryptedAddress,
  EncryptedBool,
  EncryptedUint64,
  EncryptedUint8,
} from "../src/sdk/types";
import { PermissionV2 } from "../src/extensions/types";

describe("PermitV2 Tests", () => {
  let bobPublicKey: string;
  let bobProvider: MockProvider;
  let bobSigner: MockSigner;
  let bobAddress: string;

  let adaPublicKey: string;
  let adaProvider: MockProvider;
  let adaSigner: MockSigner;
  let adaAddress: string;

  const contractAddress = "0x1c786b8ca49D932AFaDCEc00827352B503edf16c";
  const contractAddress2 = "0xB170fC5BAC4a87A63fC84653Ee7e0db65CC62f96";
  const counterProjectId = "COUNTER";
  const uniswapProjectId = "UNISWAP";

  beforeAll(async () => {
    bobPublicKey = createTfhePublicKey();
    bobProvider = new MockProvider(bobPublicKey);
    bobSigner = await bobProvider.getSigner();
    bobAddress = await bobSigner.getAddress();

    adaPublicKey = createTfhePublicKey();
    adaProvider = new MockProvider(adaPublicKey);
    adaSigner = await adaProvider.getSigner();
    adaAddress = await adaSigner.getAddress();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be in jsdom environment", async () => {
    expect(typeof window).not.toBe("undefined");
  });

  it("constructor", async () => {
    const client = new FhenixClientV2();
    expect(client).to.not.be.null;
  });
  it("initialize", async () => {
    const client = new FhenixClientV2();
    await client.initialize({
      account: bobAddress,
      send: bobProvider.send,
      signTypedData: bobSigner._signTypedData,
    });

    expect(client.fhevmInitialized).to.eq(true);
    expect(client.fhePublicKeysInitialized).to.eq(true);
  });
  it("re-initialize (change account)");
  it("encrypt");
  it("encryptTyped", async () => {
    const client = new FhenixClientV2();
    await client.initialize({
      account: bobAddress,
      send: bobProvider.send,
      signTypedData: bobSigner._signTypedData,
    });

    await client.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });

    const PermissionSlot = "permission" as const;

    const injectedPermission = client.encryptTyped(PermissionSlot);
    expectTypeOf(injectedPermission).toEqualTypeOf<PermissionV2>();

    const nestedEncrypt = client.encryptTyped([
      PermissionSlot,
      { a: Encryptable.bool(false), b: Encryptable.uint64(10n), c: "hello" },
      ["hello", 20n, Encryptable.address(contractAddress)],
      Encryptable.uint8(10),
    ] as const);

    type ExpectedEncryptedType = [
      PermissionV2,
      Readonly<{ a: EncryptedBool; b: EncryptedUint64; c: string }>,
      Readonly<[string, bigint, EncryptedAddress]>,
      EncryptedUint8,
    ];

    expectTypeOf<Readonly<ExpectedEncryptedType>>().toEqualTypeOf(
      nestedEncrypt,
    );

    const inlineEncrypt = client.encryptTyped(
      PermissionSlot,
      {
        a: Encryptable.bool(false),
        b: Encryptable.uint64(10n),
        c: "hello",
      } as const,
      ["hello", 20n, Encryptable.address(contractAddress)] as const,
      Encryptable.uint8(10),
    );

    expectTypeOf<ExpectedEncryptedType>().toEqualTypeOf(inlineEncrypt);
  });
  it("createPermit");
  it("importPermit");
  it("selectActivePermit");
  it("getPermit");
  it("getPermission");
  it("getAllPermits");
  it("unseal");
  it("unsealTyped");
});
