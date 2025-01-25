import { z } from "zod";
/**
 * Validator for the params used when creating a fresh PermitV2
 * Has defaults added that will be populated in the options object
 * Signatures superRefinement checks only the recipient, sealingPair and signatures are not necessary in the Permit params
 */
export declare const PermitV2ParamsValidator: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
    name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    type: z.ZodEnum<["self", "sharing", "recipient"]>;
    issuer: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    expiration: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    contracts: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    projects: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    recipient: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodString>>, string, string | undefined>;
    validatorId: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    validatorContract: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodString>>, string, string | undefined>;
    sealingPair: z.ZodOptional<z.ZodObject<{
        privateKey: z.ZodString;
        publicKey: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        publicKey: string;
        privateKey: string;
    }, {
        publicKey: string;
        privateKey: string;
    }>>;
    issuerSignature: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    recipientSignature: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "recipient" | "self" | "sharing";
    issuer: string;
    expiration: number;
    contracts: string[];
    projects: string[];
    recipient: string;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
}, {
    type: "recipient" | "self" | "sharing";
    issuer: string;
    name?: string | undefined;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
    expiration?: number | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    recipient?: string | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    name: string;
    type: "recipient" | "self" | "sharing";
    issuer: string;
    expiration: number;
    contracts: string[];
    projects: string[];
    recipient: string;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
}, {
    type: "recipient" | "self" | "sharing";
    issuer: string;
    name?: string | undefined;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
    expiration?: number | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    recipient?: string | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    name: string;
    type: "recipient" | "self" | "sharing";
    issuer: string;
    expiration: number;
    contracts: string[];
    projects: string[];
    recipient: string;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
}, {
    type: "recipient" | "self" | "sharing";
    issuer: string;
    name?: string | undefined;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
    expiration?: number | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    recipient?: string | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    name: string;
    type: "recipient" | "self" | "sharing";
    issuer: string;
    expiration: number;
    contracts: string[];
    projects: string[];
    recipient: string;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
}, {
    type: "recipient" | "self" | "sharing";
    issuer: string;
    name?: string | undefined;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
    expiration?: number | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    recipient?: string | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>;
/**
 * Validator for a PermitV2 that is expected to be fully formed
 * Does not allow optional values or offer defaults
 * Validates that the correct signatures are populated
 * Validates sealingPair is populated
 */
export declare const FullyFormedPermitV2Validator: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
    name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    type: z.ZodEnum<["self", "sharing", "recipient"]>;
    issuer: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    expiration: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    contracts: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    projects: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    recipient: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodString>>, string, string | undefined>;
    validatorId: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    validatorContract: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodString>>, string, string | undefined>;
    sealingPair: z.ZodObject<{
        privateKey: z.ZodString;
        publicKey: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        publicKey: string;
        privateKey: string;
    }, {
        publicKey: string;
        privateKey: string;
    }>;
    issuerSignature: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    recipientSignature: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "recipient" | "self" | "sharing";
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuer: string;
    expiration: number;
    contracts: string[];
    projects: string[];
    recipient: string;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
}, {
    type: "recipient" | "self" | "sharing";
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuer: string;
    name?: string | undefined;
    expiration?: number | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    recipient?: string | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    name: string;
    type: "recipient" | "self" | "sharing";
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuer: string;
    expiration: number;
    contracts: string[];
    projects: string[];
    recipient: string;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
}, {
    type: "recipient" | "self" | "sharing";
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuer: string;
    name?: string | undefined;
    expiration?: number | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    recipient?: string | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    name: string;
    type: "recipient" | "self" | "sharing";
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuer: string;
    expiration: number;
    contracts: string[];
    projects: string[];
    recipient: string;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
}, {
    type: "recipient" | "self" | "sharing";
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuer: string;
    name?: string | undefined;
    expiration?: number | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    recipient?: string | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    name: string;
    type: "recipient" | "self" | "sharing";
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuer: string;
    expiration: number;
    contracts: string[];
    projects: string[];
    recipient: string;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
}, {
    type: "recipient" | "self" | "sharing";
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuer: string;
    name?: string | undefined;
    expiration?: number | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    recipient?: string | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>;
//# sourceMappingURL=permit.z.d.ts.map