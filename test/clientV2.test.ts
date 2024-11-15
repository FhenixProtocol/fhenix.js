/**
 * @vitest-environment happy-dom
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { createTfhePublicKey } from "./keygen";
import { AdaWallet, BobWallet, MockProvider, MockSigner } from "./utils";
import { afterEach } from "vitest";
import { FhenixClientV2, FhenixClientV2InitParams } from "../src/sdk/clientV2";
import {
  Encryptable,
  EncryptedAddress,
  EncryptedBool,
  EncryptedUint64,
  EncryptedUint8,
  SealedAddress,
  SealedBool,
  SealedUint,
} from "../src/sdk/types";
import { PermissionV2 } from "../src/extensions/types";
import { fhenixjsStore } from "../src/extensions/permitsStore";
import { PermitV2 } from "../src/sdk/permitV2";
import { Primitive } from "type-fest";
import { SealingKey } from "../src/fhenix";
import { getAddress } from "ethers";

describe("FhenixClientV2 Tests", () => {
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

  const initBobClient = async () => {
    const client = new FhenixClientV2();
    await client.initialize({
      account: bobAddress,
      send: bobProvider.send,
      signTypedData: bobSigner.signTypedData,
    });
    return client;
  };
  const initAdaClient = async () => {
    const client = new FhenixClientV2();
    await client.initialize({
      account: bobAddress,
      send: bobProvider.send,
      signTypedData: bobSigner.signTypedData,
    });
    return client;
  };

  beforeAll(async () => {
    bobPublicKey = createTfhePublicKey();
    bobProvider = new MockProvider(bobPublicKey, BobWallet);
    bobSigner = await bobProvider.getSigner();
    bobAddress = await bobSigner.getAddress();

    adaPublicKey = createTfhePublicKey();
    adaProvider = new MockProvider(adaPublicKey, AdaWallet);
    adaSigner = await adaProvider.getSigner();
    adaAddress = await adaSigner.getAddress();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be in happy-dom environment", async () => {
    expect(typeof window).not.toBe("undefined");
  });

  it("constructor", async () => {
    const client = new FhenixClientV2();
    expect(client).to.not.be.null;
  });

  it("initialize", async () => {
    const successClient = await initBobClient();
    expect(successClient.fhevmInitialized).to.eq(true);
    expect(successClient.fhePublicKeysInitialized).to.eq(true);

    const client = new FhenixClientV2();
    expect(
      client.initialize({
        // account: bobAddress, <== Missing
        send: bobProvider.send,
        signTypedData: bobSigner.signTypedData,
      } as unknown as FhenixClientV2InitParams),
    ).rejects.toThrow(
      "Failed to initialize Fhenix Client - must include account, send function, and signTypedData functions",
    );
    expect(
      client.initialize({
        account: bobAddress,
        // send: bobProvider.send, <== Missing
        signTypedData: bobSigner.signTypedData,
      } as unknown as FhenixClientV2InitParams),
    ).rejects.toThrow(
      "Failed to initialize Fhenix Client - must include account, send function, and signTypedData functions",
    );
    expect(
      client.initialize({
        account: bobAddress,
        send: bobProvider.send,
        // signTypedData: bobSigner.signTypedData, <== Missing
      } as unknown as FhenixClientV2InitParams),
    ).rejects.toThrow(
      "Failed to initialize Fhenix Client - must include account, send function, and signTypedData functions",
    );
  });

  it("re-initialize (change account)", async () => {
    const client = await initBobClient();

    // Bob doesn't have an active permit before it is created

    let bobFetchedPermit = await client.getPermit();
    expect(bobFetchedPermit.success).to.eq(false);
    expect(bobFetchedPermit.error).to.eq("active permit not found");

    const bobCreatedPermit = await client.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });

    // Bob's new permit is the active permit

    bobFetchedPermit = await client.getPermit();
    expect(bobFetchedPermit.success).to.eq(true);
    expect(bobFetchedPermit.data?.getHash()).to.eq(bobCreatedPermit.getHash());

    await client.initialize({
      account: adaAddress,
      send: adaProvider.send,
      signTypedData: adaSigner.signTypedData,
    });

    // Ada does not have an active permit

    let adaFetchedPermit = await client.getPermit();
    expect(adaFetchedPermit.success).to.eq(false);
    expect(adaFetchedPermit.error).to.eq("active permit not found");

    const adaCreatedPermit = await client.createPermit({
      type: "self",
      issuer: adaAddress,
      projects: [counterProjectId],
    });

    // Adas active permit set

    adaFetchedPermit = await client.getPermit();
    expect(adaFetchedPermit.success).to.eq(true);
    expect(adaFetchedPermit.data?.getHash()).to.eq(adaCreatedPermit.getHash());

    // Switch back to bob

    await client.initialize({
      account: bobAddress,
      send: bobProvider.send,
      signTypedData: bobSigner.signTypedData,
    });

    // Bob's active permit is pulled from the store and exists

    bobFetchedPermit = await client.getPermit();
    expect(bobFetchedPermit.success).to.eq(true);
    expect(bobFetchedPermit.data?.getHash()).to.eq(bobCreatedPermit.getHash());
  });

  it("encrypt");

  it("encryptTyped", async () => {
    const client = await initBobClient();

    await client.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });

    const PermissionSlot = "permission" as const;

    const injectedPermission = client.encrypt(PermissionSlot);
    expectTypeOf(injectedPermission).toEqualTypeOf<PermissionV2>();

    const nestedEncrypt = client.encrypt([
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

    const inlineEncrypt = client.encrypt(
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

  // PERMITS

  // Most of the PermitV2 logic is held within the PermitV2 class
  // This core functionality is tested in permitV2.test.ts
  // The FhenixClientV2 acts as a utility layer to improve the experience of working with PermitV2s
  // The following tests target the client interaction with localstorage and its own reused stateful variables
  //   (this.account, this.chainId, this.send, this.signTypedData)
  // @architect-dev 2024-11-14

  it("localstorage", async () => {
    // FhenixClientV2 leverages a persisted zustand store to handle localstorage
    // zustand persist is heavily tested, this test is just to ensure that its working in our implementation

    const client = await initBobClient();
    const permit1 = await client.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });
    const permit2 = await client.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId, uniswapProjectId],
      contracts: [contractAddress2],
    });

    const dumpLocalStorage = (): { [key: string]: object } => {
      const dump: { [key: string]: object } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          dump[key] = JSON.parse(localStorage.getItem(key) || "");
        }
      }
      return dump;
    };

    // Store
    const dumped = dumpLocalStorage();
    expect(dumped).to.have.key("fhenix.js");
    expect(dumped["fhenix.js"]["state"]).to.have.keys(
      "permits",
      "activePermitHash",
      "fheKeys",
    );

    // Permits
    const bobsPermitsDumped =
      dumped["fhenix.js"]["state"]["permits"][bobAddress];
    expect(bobsPermitsDumped).to.have.keys(
      permit1.getHash(),
      permit2.getHash(),
    );

    // ActivePermit
    expect(dumped["fhenix.js"]["state"]["activePermitHash"][bobAddress]).to.eq(
      permit2.getHash(),
    );
  });
  it("createPermit", async () => {
    let client = new FhenixClientV2();

    expect(
      client.createPermit({
        type: "self",
        issuer: bobAddress,
        projects: [counterProjectId],
      }),
    ).rejects.toThrow("Cannot generate permit without chainId or account");

    client = await initBobClient();
    const permit = await client.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });

    // Permit established in store

    const storePermitSerialized =
      fhenixjsStore.getState().permits[bobAddress]?.[permit.getHash()];
    expect(storePermitSerialized).to.not.be.null;

    const storePermit = PermitV2.deserialize(storePermitSerialized!);
    expect(storePermit.getHash()).to.eq(permit.getHash());

    // Is active permit

    const storeActivePermitHash =
      fhenixjsStore.getState().activePermitHash[bobAddress];
    expect(storeActivePermitHash).to.eq(permit.getHash());

    // Creating new permit

    const permit2 = await client.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });

    const storeActivePermitHash2 =
      fhenixjsStore.getState().activePermitHash[bobAddress];
    expect(storeActivePermitHash2).to.eq(permit2.getHash());
  });

  // The remaining functions rely on the same logic:
  it("importPermit");
  it("selectActivePermit");
  it("getPermit");
  it("getPermission");
  it("getAllPermits");

  // UNSEAL

  it("unseal", async () => {
    const client = await initBobClient();
    const permit = await client.createPermit({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    // Bool
    const boolValue = true;
    const boolCiphertext = SealingKey.seal(
      boolValue ? 1 : 0,
      permit.sealingPair.publicKey,
    );
    const boolCleartext = permit.unsealCiphertext(boolCiphertext);
    expect(boolCleartext).to.eq(boolValue ? 1n : 0n);

    // Uint
    const uintValue = 937387;
    const uintCiphertext = SealingKey.seal(
      uintValue,
      permit.sealingPair.publicKey,
    );
    const uintCleartext = permit.unsealCiphertext(uintCiphertext);
    expect(uintCleartext).to.eq(BigInt(uintValue));

    // Address
    const bnToAddress = (bn: bigint) =>
      getAddress(`0x${bn.toString(16).slice(-40)}`);
    const addressValue = contractAddress;
    const addressCiphertext = SealingKey.seal(
      BigInt(addressValue),
      permit.sealingPair.publicKey,
    );
    const addressCleartext = permit.unsealCiphertext(addressCiphertext);
    expect(bnToAddress(addressCleartext)).to.eq(addressValue);
  });
  it("unsealTyped", async () => {
    const permit = await PermitV2.create({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    // Bool
    const boolValue = true;
    const boolCipherStruct: SealedBool = {
      data: SealingKey.seal(boolValue ? 1 : 0, permit.sealingPair.publicKey),
      utype: 13,
    };

    // Uint
    const uintValue = 937387n;
    const uintCipherStruct: SealedUint = {
      data: SealingKey.seal(uintValue, permit.sealingPair.publicKey),
      utype: 4,
    };

    // Address
    const addressValue = contractAddress;
    const addressCipherStruct: SealedAddress = {
      data: SealingKey.seal(BigInt(addressValue), permit.sealingPair.publicKey),
      utype: 12,
    };

    // Array - Nested
    const nestedCleartext = permit.unseal([
      boolCipherStruct,
      uintCipherStruct,
      addressCipherStruct,
    ] as const);

    type ExpectedCleartextType = Readonly<[boolean, bigint, string]>;

    const expectedCleartext = [boolValue, uintValue, addressValue];

    expectTypeOf(nestedCleartext).toEqualTypeOf<ExpectedCleartextType>();

    expect(nestedCleartext).to.deep.eq(expectedCleartext);
  });
});
