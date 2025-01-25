import { EIP712Message, EIP712Types } from "../../extensions/access_control/EIP712";
import { PermissionV2 } from "./types";
export declare const SignatureTypes: {
    readonly PermissionedV2IssuerSelf: ("issuer" | "expiration" | "contracts" | "projects" | "recipient" | "validatorId" | "validatorContract" | "sealingKey")[];
    readonly PermissionedV2IssuerShared: ("issuer" | "expiration" | "contracts" | "projects" | "recipient" | "validatorId" | "validatorContract")[];
    readonly PermissionedV2Recipient: ("issuerSignature" | "sealingKey")[];
};
export type PermitV2SignaturePrimaryType = keyof typeof SignatureTypes;
export declare const getSignatureTypesAndMessage: <T extends "issuer" | "expiration" | "contracts" | "projects" | "recipient" | "validatorId" | "validatorContract" | "issuerSignature" | "sealingKey">(primaryType: PermitV2SignaturePrimaryType, fields: T[] | readonly T[], values: Pick<PermissionV2, T> & Partial<PermissionV2>) => {
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
//# sourceMappingURL=permit.generate.d.ts.map