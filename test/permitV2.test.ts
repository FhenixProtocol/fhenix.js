/**
 * @vitest-environment happy-dom
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { SealingKey } from "../lib/esm";
import { createTfhePublicKey } from "./keygen";
import { AdaWallet, BobWallet, MockProvider, MockSigner } from "./utils";
import { afterEach } from "vitest";
import { PermitV2 } from "../src/sdk/permitV2/permitV2";
import { getAddress, ZeroAddress } from "ethers";
import { SealedAddress, SealedBool, SealedUint } from "../src/sdk/types";

describe.only("PermitV2 Tests", () => {
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

  it("create (self)", async () => {
    const permit = await PermitV2.create({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    expect(permit.type).to.eq("self");
    expect(permit.issuer).to.eq(bobAddress);

    // Check defaults here, skipped elsewhere
    expect(permit.contracts).to.deep.eq([contractAddress, contractAddress2]);
    expect(permit.projects).to.deep.eq([counterProjectId]);
    expect(permit.expiration).to.eq(1000000000000);
    expect(permit.recipient).to.eq(ZeroAddress);
    expect(permit.validatorId).to.eq(0);
    expect(permit.validatorContract).to.eq(ZeroAddress);
    expect(permit.sealingPair).to.not.be.null;
    expect(permit.issuerSignature).to.eq("0x");
    expect(permit.recipientSignature).to.eq("0x");

    // Validity
    expect(permit.isSigned()).to.eq(false);
    expect(permit.isExpired()).to.eq(false);
    expect(permit.isValid()).to.deep.eq({ valid: false, error: "not-signed" });

    // Sealing pair can decrypt
    const value = 937387;
    const ciphertext = SealingKey.seal(value, permit.sealingPair.publicKey);
    const cleartext = permit.unsealCiphertext(ciphertext);
    expect(cleartext).to.eq(BigInt(value));
  });
  it("create (sharing)", async () => {
    const permit = await PermitV2.create({
      type: "sharing",
      issuer: bobAddress,
      recipient: adaAddress,
      projects: [counterProjectId],
    });

    expect(permit.type).to.eq("sharing");
    expect(permit.issuer).to.eq(bobAddress);
    expect(permit.recipient).to.eq(adaAddress);
  });
  it("create (recipient)", async () => {
    const permit = await PermitV2.create({
      type: "recipient",
      issuer: bobAddress,
      recipient: adaAddress,
      issuerSignature: "0xBobSignature",
      projects: [counterProjectId],
    });

    expect(permit.type).to.eq("recipient");
    expect(permit.issuer).to.eq(bobAddress);
    expect(permit.recipient).to.eq(adaAddress);
    expect(permit.issuerSignature).to.eq("0xBobSignature");
  });

  it("sign (self)", async () => {
    const permit = await PermitV2.create({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    await permit.sign(bobProvider.chainId, bobSigner);

    expect(permit.issuerSignature).to.not.eq("0x");
    expect(permit.recipientSignature).to.eq("0x");
  });
  it("sign (sharing)", async () => {
    const permit = await PermitV2.create({
      type: "sharing",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
      recipient: adaAddress,
    });

    await permit.sign(bobProvider.chainId, bobSigner);

    expect(permit.issuerSignature).to.not.eq("0x");
    expect(permit.recipientSignature).to.eq("0x");
  });
  it("sign (recipient)", async () => {
    const bobPermit = await PermitV2.create({
      type: "sharing",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
      recipient: adaAddress,
    });

    expect(bobPermit.issuerSignature).to.eq("0x");
    expect(bobPermit.recipientSignature).to.eq("0x");

    await bobPermit.sign(bobProvider.chainId, bobSigner);

    expect(bobPermit.issuerSignature).to.not.eq("0x");
    expect(bobPermit.recipientSignature).to.eq("0x");

    const adaPermit = await PermitV2.create({
      ...bobPermit,
      type: "recipient",
    });

    expect(adaPermit.issuerSignature).to.not.eq("0x");
    expect(adaPermit.recipientSignature).to.eq("0x");

    await adaPermit.sign(adaProvider.chainId, adaSigner);

    expect(adaPermit.issuerSignature).to.not.eq("0x");
    expect(adaPermit.recipientSignature).to.not.eq("0x");
  });

  it("getPermission", async () => {
    const permit = await PermitV2.create({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    await permit.sign(bobProvider.chainId, bobSigner);

    const { type, sealingPair, ...iface } = permit.getInterface();
    const { sealingKey, ...permission } = permit.getPermission();

    expect(iface).to.deep.eq(permission);
    expect(`0x${sealingPair.publicKey}`).to.eq(sealingKey);
  });
  it("getHash", async () => {
    const permit = await PermitV2.create({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    const permit2 = await PermitV2.create({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    // Stable hashes
    expect(permit.getHash()).to.eq(permit2.getHash());
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
    const boolCleartext = permit.unseal(boolCipherStruct);
    expect(boolCleartext).to.eq(boolValue);

    // Uint
    const uintValue = 937387n;
    const uintCipherStruct: SealedUint = {
      data: SealingKey.seal(uintValue, permit.sealingPair.publicKey),
      utype: 4,
    };
    const uintCleartext = permit.unseal(uintCipherStruct);
    expect(uintCleartext).to.eq(uintValue);

    // Address
    const addressValue = contractAddress;
    const addressCipherStruct: SealedAddress = {
      data: SealingKey.seal(BigInt(addressValue), permit.sealingPair.publicKey),
      utype: 12,
    };
    const addressCleartext = permit.unseal(addressCipherStruct);
    expect(addressCleartext).to.eq(addressValue);

    // Array - Nested
    const nestedCleartext = permit.unseal([
      boolCipherStruct,
      ["hello", "world"],
      uintCipherStruct,
      5,
      addressCipherStruct,
      false,
      20n,
      {
        bool: boolCipherStruct,
        uint: uintCipherStruct,
        address: addressCipherStruct,
        clear: "clear",
      },
    ] as const);

    type ExpectedCleartextType = Readonly<
      [
        boolean,
        readonly [string, string],
        bigint,
        number,
        string,
        boolean,
        bigint,
        {
          readonly bool: boolean;
          readonly uint: bigint;
          readonly address: string;
          readonly clear: string;
        },
      ]
    >;

    const expectedCleartext: ExpectedCleartextType = [
      boolValue,
      ["hello", "world"],
      uintValue,
      5,
      addressValue,
      false,
      20n,
      {
        bool: boolValue,
        uint: uintValue,
        address: addressValue,
        clear: "clear",
      },
    ];

    expectTypeOf<
      typeof nestedCleartext
    >().toEqualTypeOf<ExpectedCleartextType>();

    expect(nestedCleartext).to.deep.eq(expectedCleartext);
  });

  it("serialize", async () => {
    const permit = await PermitV2.create({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    const serialized = permit.serialize();
    expect(serialized.sealingPair.publicKey).to.eq(
      permit.sealingPair.publicKey,
    );
    expect(serialized.sealingPair.privateKey).to.eq(
      permit.sealingPair.privateKey,
    );
  });
  it("deserialize", async () => {
    const permit = await PermitV2.create({
      type: "self",
      issuer: bobAddress,
      contracts: [contractAddress, contractAddress2],
      projects: [counterProjectId],
    });

    await permit.sign(bobProvider.chainId, bobSigner);

    const serialized = permit.serialize();

    const deserialized = PermitV2.deserialize(serialized);

    expect(serialized.issuer).to.eq(deserialized.issuer);
    expect(serialized.contracts).to.deep.eq(deserialized.contracts);
    expect(serialized.projects).to.deep.eq(deserialized.projects);
    expect(serialized.recipient).to.eq(deserialized.recipient);
    expect(serialized.issuerSignature).to.eq(deserialized.issuerSignature);
    expect(serialized.recipientSignature).to.eq(
      deserialized.recipientSignature,
    );
    expect(serialized.validatorId).to.eq(deserialized.validatorId);
    expect(serialized.validatorContract).to.eq(deserialized.validatorContract);
    expect(serialized.sealingPair.publicKey).to.eq(
      deserialized.sealingPair.publicKey,
    );
    expect(serialized.sealingPair.privateKey).to.eq(
      deserialized.sealingPair.privateKey,
    );
  });
});
