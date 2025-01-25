import { PermissionV2 } from "../../types";
import { EIP712Message, EIP712Types } from "../../types/EIP712";
export declare const SignatureTypes: {
    readonly PermissionedV2IssuerSelf: ("recipient" | "contracts" | "projects" | "issuer" | "expiration" | "validatorId" | "validatorContract" | "sealingKey")[];
    readonly PermissionedV2IssuerShared: ("recipient" | "contracts" | "projects" | "issuer" | "expiration" | "validatorId" | "validatorContract")[];
    readonly PermissionedV2Recipient: ("issuerSignature" | "sealingKey")[];
};
export type PermitV2SignaturePrimaryType = keyof typeof SignatureTypes;
export declare const getSignatureTypesAndMessage: <T extends "recipient" | "contracts" | "projects" | "issuer" | "expiration" | "validatorId" | "validatorContract" | "issuerSignature" | "sealingKey">(primaryType: PermitV2SignaturePrimaryType, fields: T[] | readonly T[], values: Pick<PermissionV2, T> & Partial<PermissionV2>) => {
    types: EIP712Types;
    primaryType: string;
    message: EIP712Message;
};
export declare const getSignatureDomain: (chainId: string) => {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
};
//# sourceMappingURL=generate.d.ts.map