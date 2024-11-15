import { PermissionV2 } from "../../../sdk/types";
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

export const SignatureTypes = {
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

export const getSignatureTypesAndMessage = <
  T extends PermitV2SignatureFieldOption,
>(
  typeName: SignatureIdentifier,
  fields: T[] | readonly T[],
  values: Pick<PermissionV2, T> & Partial<PermissionV2>,
): { types: EIP712Types; message: EIP712Message } => {
  const types = {
    [typeName]: PermitV2SignatureAllFields.filter((fieldType) =>
      fields.includes(fieldType.name as T),
    ),
  };

  const message: Record<T, string | string[] | number | number[]> =
    {} as Record<T, string | string[] | number | number[]>;
  fields.forEach((field) => {
    if (field in values) {
      message[field] = values[field];
    }
  });

  return { types, message: message as EIP712Message };
};
