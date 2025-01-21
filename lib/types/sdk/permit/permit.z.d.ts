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
    recipient: string;
    contracts: string[];
    projects: string[];
    name: string;
    type: "self" | "sharing" | "recipient";
    issuer: string;
    expiration: number;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
}, {
    type: "self" | "sharing" | "recipient";
    issuer: string;
    recipient?: string | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    name?: string | undefined;
    expiration?: number | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    recipient: string;
    contracts: string[];
    projects: string[];
    name: string;
    type: "self" | "sharing" | "recipient";
    issuer: string;
    expiration: number;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
}, {
    type: "self" | "sharing" | "recipient";
    issuer: string;
    recipient?: string | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    name?: string | undefined;
    expiration?: number | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    recipient: string;
    contracts: string[];
    projects: string[];
    name: string;
    type: "self" | "sharing" | "recipient";
    issuer: string;
    expiration: number;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
}, {
    type: "self" | "sharing" | "recipient";
    issuer: string;
    recipient?: string | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    name?: string | undefined;
    expiration?: number | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    recipient: string;
    contracts: string[];
    projects: string[];
    name: string;
    type: "self" | "sharing" | "recipient";
    issuer: string;
    expiration: number;
    validatorId: number;
    validatorContract: string;
    issuerSignature: string;
    recipientSignature: string;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
}, {
    type: "self" | "sharing" | "recipient";
    issuer: string;
    recipient?: string | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    name?: string | undefined;
    expiration?: number | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    sealingPair?: {
        publicKey: string;
        privateKey: string;
    } | undefined;
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
    recipient: string;
    contracts: string[];
    projects: string[];
    name: string;
    type: "self" | "sharing" | "recipient";
    issuer: string;
    expiration: number;
    validatorId: number;
    validatorContract: string;
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuerSignature: string;
    recipientSignature: string;
}, {
    type: "self" | "sharing" | "recipient";
    issuer: string;
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    recipient?: string | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    name?: string | undefined;
    expiration?: number | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    recipient: string;
    contracts: string[];
    projects: string[];
    name: string;
    type: "self" | "sharing" | "recipient";
    issuer: string;
    expiration: number;
    validatorId: number;
    validatorContract: string;
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuerSignature: string;
    recipientSignature: string;
}, {
    type: "self" | "sharing" | "recipient";
    issuer: string;
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    recipient?: string | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    name?: string | undefined;
    expiration?: number | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    recipient: string;
    contracts: string[];
    projects: string[];
    name: string;
    type: "self" | "sharing" | "recipient";
    issuer: string;
    expiration: number;
    validatorId: number;
    validatorContract: string;
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuerSignature: string;
    recipientSignature: string;
}, {
    type: "self" | "sharing" | "recipient";
    issuer: string;
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    recipient?: string | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    name?: string | undefined;
    expiration?: number | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>, {
    recipient: string;
    contracts: string[];
    projects: string[];
    name: string;
    type: "self" | "sharing" | "recipient";
    issuer: string;
    expiration: number;
    validatorId: number;
    validatorContract: string;
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    issuerSignature: string;
    recipientSignature: string;
}, {
    type: "self" | "sharing" | "recipient";
    issuer: string;
    sealingPair: {
        publicKey: string;
        privateKey: string;
    };
    recipient?: string | undefined;
    contracts?: string[] | undefined;
    projects?: string[] | undefined;
    name?: string | undefined;
    expiration?: number | undefined;
    validatorId?: number | undefined;
    validatorContract?: string | undefined;
    issuerSignature?: string | undefined;
    recipientSignature?: string | undefined;
}>;
//# sourceMappingURL=permit.z.d.ts.map