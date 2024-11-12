import { ZeroAddress } from "ethers";
import {
  PermitV2Options,
  SignTypedDataFn,
  PermitV2,
  Expand,
  PermissionV2,
} from "../../types";
import { GenerateSealingKey } from "../../../sdk/sealing";
import { EIP712Types, EIP712Message } from "../EIP712";

const PermitV2SignatureAllFields = [
  { name: "issuer", type: "address" },
  { name: "expiration", type: "uint64" },
  { name: "contracts", type: "address[]" },
  { name: "projects", type: "string[]" },
  { name: "recipient", type: "address" },
  { name: "validatorId", type: "uint256" },
  { name: "validatorContract", type: "address" },
  { name: "sealingKey", type: "bytes32" },
  { name: "issuerSignature", type: "bytes" },
] as const;
type PermitV2SignatureFieldOption =
  (typeof PermitV2SignatureAllFields)[number]["name"];

const SignatureTypes = {
  PermissionedV2IssuerSelf: [
    "issuer",
    "expiration",
    "contracts",
    "projects",
    "recipient",
    "validatorId",
    "validatorContract",
    "sealingKey",
  ] satisfies PermitV2SignatureFieldOption[],
  PermissionedV2IssuerShared: [
    "issuer",
    "expiration",
    "contracts",
    "projects",
    "recipient",
    "validatorId",
    "validatorContract",
  ] satisfies PermitV2SignatureFieldOption[],
  PermissionedV2Receiver: [
    "sealingKey",
    "issuerSignature",
  ] satisfies PermitV2SignatureFieldOption[],
} as const;
type SignatureIdentifier = keyof typeof SignatureTypes;

const getSignatureTypesAndMessage = <T extends PermitV2SignatureFieldOption>(
  typeName: SignatureIdentifier,
  fields: T[] | readonly T[],
  values: Expand<Pick<PermissionV2, T> & Partial<PermissionV2>>,
): { types: EIP712Types; message: EIP712Message } => {
  const types = {
    [typeName]: PermitV2SignatureAllFields.filter((fieldType) =>
      fields.includes(fieldType.name as T),
    ),
  };

  const message: EIP712Message = {};
  for (const field in fields) {
    message[field] = values[field];
  }

  return { types, message };
};

export const generatePermitV2 = async (
  chainId: string,
  options: PermitV2Options,
  signTypedData: SignTypedDataFn,
): Promise<PermitV2> => {
  const {
    issuer,
    contracts = [],
    projects = [],
    expiration = 1000000000000,
    recipient = ZeroAddress,
    validatorId = 0,
    validatorContract = ZeroAddress,
  } = options;

  const isSharing = recipient !== ZeroAddress;

  const keypair = await GenerateSealingKey();

  const signatureName = isSharing
    ? "PermissionedV2IssuerShared"
    : "PermissionedV2IssuerSelf";

  const { types, message } = getSignatureTypesAndMessage(
    signatureName,
    SignatureTypes[signatureName],
    {
      issuer,
      sealingKey: `0x${keypair.publicKey}`,
      expiration,
      contracts,
      projects,
      recipient,
      validatorId,
      validatorContract,
    },
  );

  const issuerSignature = await signTypedData(
    {
      name: "Fhenix Permission v2.0.0",
      version: "v2.0.0",
      chainId,
      verifyingContract: ZeroAddress,
    },
    types,
    message,
  );

  const permitV2: PermitV2 = {
    issuer,
    expiration,
    sealingPair: keypair,
    contracts,
    projects,
    recipient: recipient,
    validatorId,
    validatorContract,
    issuerSignature,
    recipientSignature: "0x",
  };

  return permitV2;
};
