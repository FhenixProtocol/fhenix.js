import { isAddress, ZeroAddress } from "ethers";
import { z } from "zod";
const SerializedSealingPair = z.object({
    privateKey: z.string(),
    publicKey: z.string(),
});
const zPermitV2WithDefaults = z.object({
    name: z.string().optional().default("Unnamed Permit"),
    type: z.enum(["self", "sharing", "recipient"]),
    issuer: z
        .string()
        .refine((val) => isAddress(val), {
        message: "PermitV2 issuer :: invalid address",
    })
        .refine((val) => val !== ZeroAddress, {
        message: "PermitV2 issuer :: must not be zeroAddress",
    }),
    expiration: z.number().optional().default(1000000000000),
    contracts: z.array(z.string()).optional().default([]),
    projects: z.array(z.string()).optional().default([]),
    recipient: z
        .string()
        .optional()
        .default(ZeroAddress)
        .refine((val) => isAddress(val), {
        message: "PermitV2 recipient :: invalid address",
    }),
    validatorId: z.number().optional().default(0),
    validatorContract: z
        .string()
        .optional()
        .default(ZeroAddress)
        .refine((val) => isAddress(val), {
        message: "PermitV2 validatorContract :: invalid address",
    }),
    sealingPair: SerializedSealingPair.optional(),
    issuerSignature: z.string().optional().default("0x"),
    recipientSignature: z.string().optional().default("0x"),
});
/**
 * Ensures that this Permit will provide access to a non-zero amount of contracts
 * by ensuring that `contracts` and `projects` aren't both empty arrays.
 */
const PermitV2RefineAccess = [
    (data) => {
        return data.contracts.length + data.projects.length > 0;
    },
    {
        message: "PermitV2 access :: at least one contract or project must be accessible.",
        path: ["contracts", "projects"],
    },
];
/**
 * Permits allow a hook into an optional external validator contract,
 * this check ensures that IF an external validator is applied, that both `validatorId` and `validatorContract` are populated,
 * ELSE ensures that both `validatorId` and `validatorContract` are empty
 */
const PermitV2RefineValidator = [
    (data) => (data.validatorId !== 0 && data.validatorContract !== ZeroAddress) ||
        (data.validatorId === 0 && data.validatorContract === ZeroAddress),
    {
        message: "PermitV2 external validator :: validatorId and validatorContract must either both be set or both be unset.",
        path: ["validatorId", "validatorContract"],
    },
];
/**
 * SuperRefinement that checks a PermitV2s signatures
 * checkRecipient - whether to validate that `recipient` is empty for permit with type <self>, and populated for <sharing | recipient>
 * checkSealingPair - only the fully formed permit requires the sealing pair, it can be optional for permitV2 create params
 * checkExistingSignatures - not optional - checks that the permit's type matches the populated signature fields
 * checkSigned - checks that the active user's signature has been signed and added. <self | signed> -> issuerSignature, <recipient> -> recipientSignature
 */
const PermitV2SignaturesSuperRefinement = (options) => {
    return (data, ctx) => {
        // Check Recipient
        //    If type <self | sharing>, `PermitV2.recipient` must be zeroAddress
        //    If type <recipient>, `PermitV2.recipient` must not be zeroAddress
        if (options.checkRecipient) {
            if (data.type === "self" && data.recipient !== ZeroAddress)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["recipient"],
                    message: `PermitV2 (type '${data.type}') recipient :: must be empty (zeroAddress)`,
                });
            if ((data.type === "recipient" || data.type === "sharing") &&
                data.recipient === ZeroAddress) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["recipient"],
                    message: `PermitV2 (type '${data.type}') recipient :: must not be empty`,
                });
            }
        }
        // Check Sealing Pair
        if (options.checkSealingPair && data.sealingPair == null)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["sealingPair"],
                message: `PermitV2 sealingPair :: must not be empty`,
            });
        // Check existing signatures match type (not checking this user's signature, but the other signature)
        //     If type <self | sharing>, `PermitV2.recipientSignature` must be empty
        //     If type <recipient>, `PermitV2.issuerSignature` must not be empty
        if ((data.type === "self" || data.type === "sharing") &&
            data.recipientSignature !== "0x") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["recipientSignature"],
                message: `PermitV2 (type '${data.type}') recipientSignature :: should not be populated by the issuer`,
            });
        }
        if (data.type === "recipient" && data.issuerSignature === "0x") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["issuerSignature"],
                message: `PermitV2 (type 'recipient') issuerSignature :: \`issuer\` must sign the PermitV2 before sharing it with \`recipient\``,
            });
        }
        // Check Signed
        //     If type <self | sharing>, `PermitV2.issuerSignature` must not be empty
        //     If type <recipient>, `PermitV2.recipientSignature` must not be empty
        if (options.checkSigned) {
            if ((data.type === "self" || data.type === "sharing") &&
                data.issuerSignature === "0x")
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["issuerSignature"],
                    message: `PermitV2 (type '${data.type}') issuerSignature :: must be populated with issuer's signature. Use \`PermitV2.sign\` or create permit with \`PermitV2.createAndSign\``,
                });
            if (data.type === "recipient" && data.recipientSignature === "0x") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["recipientSignature"],
                    message: `PermitV2 (type 'recipient') recipientSignature :: must be populated with recipient's signature. Use \`PermitV2.sign\` or create permit with \`PermitV2.createAndSign\``,
                });
            }
        }
        return;
    };
};
/**
 * Validator for the params used when creating a fresh PermitV2
 * Has defaults added that will be populated in the options object
 * Signatures superRefinement checks only the recipient, sealingPair and signatures are not necessary in the Permit params
 */
export const PermitV2ParamsValidator = zPermitV2WithDefaults
    .refine(...PermitV2RefineAccess)
    .refine(...PermitV2RefineValidator)
    .superRefine(PermitV2SignaturesSuperRefinement({
    checkRecipient: true,
    checkSealingPair: false, // SealingPair not required when creating a fresh permit
    checkSigned: false, // Signature not required when creating a fresh permit
}));
/**
 * Validator for a PermitV2 that is expected to be fully formed
 * Does not allow optional values or offer defaults
 * Validates that the correct signatures are populated
 * Validates sealingPair is populated
 */
export const FullyFormedPermitV2Validator = zPermitV2WithDefaults
    .required()
    .refine(...PermitV2RefineAccess)
    .refine(...PermitV2RefineValidator)
    .superRefine(PermitV2SignaturesSuperRefinement({
    checkRecipient: true,
    checkSealingPair: true,
    checkSigned: true,
}));
//# sourceMappingURL=permit.z.js.map