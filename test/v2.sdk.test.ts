/**
 * @vitest-environment happy-dom
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import {
  AdaWallet,
  BobWallet,
  MockProvider,
  MockSigner,
  uint8ArrayToString,
} from "./utils";
import { afterEach } from "vitest";
import { getAddress } from "ethers";
import {
  createTfhePublicKey,
  Encryptable,
  EncryptedAddress,
  EncryptedBool,
  EncryptedUint64,
  EncryptedUint8,
  EncryptionTypes,
  fhenixsdk,
  PermissionV2,
  permitStore,
  PermitV2,
  SealedAddress,
  SealedBool,
  SealedUint,
  SealingKey,
} from "../lib/esm";
import { _permitStore } from "../lib/esm/sdk/v2/permit.store";
import {
  _store_chainId,
  _store_getFheKey,
  InitParams,
} from "../lib/esm/sdk/v2/sdk.store";
import { Result } from "../src/sdk/v2/types";
import { FheUType } from "../src/sdk/types";

describe("Sdk Tests", () => {
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

  const initSdkWithBob = async () => {
    return fhenixsdk.initialize({
      provider: bobProvider,
      signer: bobSigner,
      projects: [counterProjectId],
    });
  };
  const initSdkWithAda = async () => {
    return fhenixsdk.initialize({
      provider: adaProvider,
      signer: adaSigner,
      projects: [counterProjectId],
    });
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

    localStorage.clear();
    fhenixsdk.store.setState(fhenixsdk.store.getInitialState());
  });

  afterEach(() => {
    localStorage.clear();
    fhenixsdk.store.setState(fhenixsdk.store.getInitialState());
    _permitStore.setState(_permitStore.getInitialState());
  });

  it("should be in happy-dom environment", async () => {
    expect(typeof window).not.toBe("undefined");
  });

  it("initialize", async () => {
    expect(fhenixsdk.store.getState().providerInitialized).toEqual(false);
    expect(fhenixsdk.store.getState().signerInitialized).toEqual(false);
    expect(fhenixsdk.store.getState().fheKeysInitialized).toEqual(false);

    await initSdkWithBob();
    expect(fhenixsdk.store.getState().providerInitialized).toEqual(true);
    expect(fhenixsdk.store.getState().signerInitialized).toEqual(true);
    expect(fhenixsdk.store.getState().fheKeysInitialized).toEqual(true);

    const initWithoutProviderResult = await fhenixsdk.initialize({
      // provider: bobProvider,
      // signer: bobSigner,
    } as unknown as InitParams);
    expect(initWithoutProviderResult.success).toEqual(false);
    expect(initWithoutProviderResult.error).toEqual(
      "initialize :: missing provider - Please provide an AbstractProvider interface",
    );

    const initWithoutSecurityZonesResult = await fhenixsdk.initialize({
      provider: bobProvider,
      signer: bobSigner,
      securityZones: [],
    } as unknown as InitParams);
    expect(initWithoutSecurityZonesResult.success).toEqual(false);
    expect(initWithoutSecurityZonesResult.error).toEqual(
      "initialize :: a list of securityZones was provided, but it is empty",
    );
  });

  it("re-initialize (change account)", async () => {
    const bobPermit = (await initSdkWithBob())!;
    expect(bobPermit.success).toEqual(true);
    expect(bobPermit.data).to.not.equal(undefined);

    // Bob's new permit is the active permit

    let bobFetchedPermit = await fhenixsdk.getPermit();
    expect(bobFetchedPermit.success).toEqual(true);
    expect(bobFetchedPermit.data?.getHash()).toEqual(bobPermit.data?.getHash());

    const adaPermit = (await initSdkWithAda())!;
    expect(adaPermit.success).toEqual(true);
    expect(adaPermit.data).to.not.equal(undefined);

    // Ada does not have an active permit

    const adaFetchedPermit = await fhenixsdk.getPermit();
    expect(adaFetchedPermit.success).toEqual(true);
    expect(adaFetchedPermit.data?.getHash()).toEqual(adaPermit.data?.getHash());

    // Switch back to bob

    // Bob's active permit is pulled from the store during init and exists
    bobFetchedPermit = (await initSdkWithBob()) as Result<PermitV2>;
    expect(bobFetchedPermit.success).toEqual(true);
    expect(bobFetchedPermit.data?.getHash()).toEqual(bobPermit.data?.getHash());
  });

  it("encrypt", async () => {
    await initSdkWithBob();

    await fhenixsdk.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });

    const PermissionSlot = "permission" as const;

    const injectedPermission = fhenixsdk.encrypt(PermissionSlot);
    expectTypeOf(injectedPermission.data!).toEqualTypeOf<PermissionV2>();

    const nestedEncrypt = fhenixsdk.encrypt([
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
      nestedEncrypt.data!,
    );
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

    await initSdkWithBob();
    const permit1 = await fhenixsdk.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });
    const permit2 = await fhenixsdk.createPermit({
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

    // Sdk Store
    const dumped = dumpLocalStorage();
    expect(dumped).to.have.keys(["fhenixjs-permits"]);

    // Permits store

    expect(dumped["fhenixjs-permits"]["state"]).to.have.keys(
      "permits",
      "activePermitHash",
    );

    // Permits
    const bobsPermitsDumped =
      dumped["fhenixjs-permits"]["state"]["permits"][bobAddress];
    expect(bobsPermitsDumped).to.have.keys(
      permit1?.data?.getHash() ?? "permit1Hash",
      permit2?.data?.getHash() ?? "permit2Hash",
    );

    // ActivePermit
    expect(
      dumped["fhenixjs-permits"]["state"]["activePermitHash"][bobAddress],
    ).toEqual(permit2?.data?.getHash());
  });
  it("createPermit", async () => {
    const createPermitWithoutInitResult = await fhenixsdk.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });
    expect(createPermitWithoutInitResult.success).toEqual(false);
    expect(createPermitWithoutInitResult.error).toEqual(
      "createPermit :: fhenixsdk not initialized. Use `fhenixsdk.initialize(...)`.",
    );

    await initSdkWithBob();
    const permit = await fhenixsdk.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });

    // Permit established in store

    const storePermitSerialized =
      permitStore.store.getState().permits[bobAddress]?.[
        permit.data!.getHash()
      ];
    expect(storePermitSerialized).to.not.be.null;

    const storePermit = PermitV2.deserialize(storePermitSerialized!);
    expect(storePermit.getHash()).toEqual(permit.data?.getHash());

    // Is active permit

    const storeActivePermitHash =
      permitStore.store.getState().activePermitHash[bobAddress];
    expect(storeActivePermitHash).toEqual(permit.data?.getHash());

    // Creating new permit

    const permit2 = await fhenixsdk.createPermit({
      type: "self",
      issuer: bobAddress,
      projects: [counterProjectId],
    });

    const storeActivePermitHash2 =
      permitStore.store.getState().activePermitHash[bobAddress];
    expect(storeActivePermitHash2).toEqual(permit2.data?.getHash());
  });

  // The remaining functions rely on the same logic:
  it("importPermit");
  it("selectActivePermit");
  it("getPermit");
  it("getPermission");
  it("getAllPermits");

  // UNSEAL

  it("unsealCiphertext", async () => {
    await initSdkWithBob();
    const permit = (
      await fhenixsdk.createPermit({
        type: "self",
        issuer: bobAddress,
        contracts: [contractAddress, contractAddress2],
        projects: [counterProjectId],
      })
    ).data!;

    // Bool
    const boolValue = true;
    const boolCiphertext = SealingKey.seal(
      boolValue ? 1 : 0,
      permit.sealingPair.publicKey,
    );
    const boolCleartext = permit.unsealCiphertext(boolCiphertext);
    expect(boolCleartext).toEqual(boolValue ? 1n : 0n);

    // Uint
    const uintValue = 937387;
    const uintCiphertext = SealingKey.seal(
      uintValue,
      permit.sealingPair.publicKey,
    );
    const uintCleartext = permit.unsealCiphertext(uintCiphertext);
    expect(uintCleartext).toEqual(BigInt(uintValue));

    // Address
    const bnToAddress = (bn: bigint) =>
      getAddress(`0x${bn.toString(16).slice(-40)}`);
    const addressValue = contractAddress;
    const addressCiphertext = SealingKey.seal(
      BigInt(addressValue),
      permit.sealingPair.publicKey,
    );
    const addressCleartext = permit.unsealCiphertext(addressCiphertext);
    expect(bnToAddress(addressCleartext)).toEqual(addressValue);
  });
  it("unseal", async () => {
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

    expect(nestedCleartext).toEqual(expectedCleartext);
  });

  it("hardhat encrypt/unseal", async () => {
    const hardhatChainId = "31337";

    bobProvider = new MockProvider(bobPublicKey, BobWallet, hardhatChainId);
    bobSigner = await bobProvider.getSigner();

    // Should initialize correctly, but fhe public key for hardhat not set
    await fhenixsdk.initialize({
      provider: bobProvider,
      signer: bobSigner,
      projects: [counterProjectId],
    });
    await fhenixsdk.createPermit();

    expect(fhenixsdk.store.getState().chainId).toEqual(hardhatChainId);
    expect(_store_chainId()).toEqual(hardhatChainId);

    expect(_store_getFheKey(hardhatChainId)).toEqual(undefined);
    expect(fhenixsdk.store.getState().fheKeys).toEqual({});

    // `unsealCiphertext`

    const encryptedValue = fhenixsdk.encryptValue(5, EncryptionTypes.uint8);
    const unsealedValue = fhenixsdk.unsealCiphertext(
      uint8ArrayToString(encryptedValue.data!.data),
    );
    expect(unsealedValue.success).toEqual(true);
    expect(unsealedValue.data).toEqual(5n);

    // `unseal`

    const intValue = 5;
    const boolValue = false;

    const [encryptedInt, encryptedBool] = fhenixsdk.encrypt([
      Encryptable.uint8(intValue),
      Encryptable.bool(boolValue),
    ]).data!;

    const sealed = [
      { data: uint8ArrayToString(encryptedInt.data), utype: FheUType.uint8 },
      { data: uint8ArrayToString(encryptedBool.data), utype: FheUType.bool },
    ];

    const [unsealedInt, unsealedBool] = fhenixsdk.unseal(sealed).data!;
    expect(unsealedInt).to.eq(BigInt(intValue));
    expect(unsealedBool).to.eq(boolValue);
  });
});
