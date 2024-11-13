import { z } from "zod";

const ZeroAddress = "0x0000000000000000000000000000000000000000";

const SerializedSealingPair = z.object({
  privateKey: z.string(),
  publicKey: z.string(),
});

// Validator for full PermitV2Interface
export const PermitV2OptionsValidator = z
  .object({
    type: z.enum(["self", "sharing", "recipient"]),
    issuer: z.string().refine((val) => val !== ZeroAddress, {
      message: "Issuer cannot be the zero address.",
    }),
    expiration: z.number().optional().default(1000000000000),
    contracts: z.array(z.string()).optional().default([]),
    projects: z.array(z.string()).optional().default([]),
    recipient: z.string().optional().default(ZeroAddress),
    validatorId: z.number().optional().default(0),
    validatorContract: z.string().optional().default(ZeroAddress),
    sealingPair: SerializedSealingPair.optional(),
    issuerSignature: z.string().optional().default("0x"),
    recipientSignature: z.string().optional().default("0x"),
  })
  .refine((data) => data.contracts.length + data.projects.length > 0, {
    message: "At least one contract or project must be accessible.",
    path: ["contracts", "projects"],
  })
  .refine(
    (data) => {
      if (data.type === "self") {
        return (
          data.recipient === ZeroAddress && data.recipientSignature === "0x"
        );
      }
      return true;
    },
    {
      message: "For type 'self', recipient / recipientSignature must be empty.",
    },
  )
  .refine(
    (data) => {
      if (data.type === "sharing") {
        return (
          data.recipient !== ZeroAddress &&
          data.sealingPair == null &&
          data.recipientSignature === "0x"
        );
      }
      return true;
    },
    {
      message:
        "For type 'sharing', recipient must be populated, and recipientSignature / sealingPair empty.",
    },
  )
  .refine(
    (data) => {
      if (data.type === "recipient") {
        return data.recipient !== ZeroAddress && data.issuerSignature !== "0x";
      }
      return true;
    },
    {
      message:
        "For type 'recipient', recipient / issuerSignature must be populated.",
    },
  )
  .refine(
    (data) =>
      (data.validatorId !== 0 && data.validatorContract !== ZeroAddress) ||
      (data.validatorId === 0 && data.validatorContract === ZeroAddress),
    {
      message:
        "validatorId and validatorContract must either both be set or both be unset.",
    },
  );

// Validator for full PermitV2Interface
export const PermitV2Validator = z
  .object({
    type: z.enum(["self", "sharing", "recipient"]),
    issuer: z.string().refine((val) => val !== ZeroAddress, {
      message: "Issuer cannot be the zero address.",
    }),
    expiration: z.number(),
    contracts: z.array(z.string()),
    projects: z.array(z.string()),
    recipient: z.string().optional().default(ZeroAddress),
    validatorId: z.number().optional().default(0),
    validatorContract: z.string().optional().default(ZeroAddress),
    sealingPair: SerializedSealingPair.optional(),
    issuerSignature: z.string(),
    recipientSignature: z.string().optional().default("0x"),
  })
  .refine((data) => data.contracts.length + data.projects.length > 0, {
    message: "At least one contract or project must be accessible.",
    path: ["contracts", "projects"],
  })
  .refine(
    (data) => {
      if (data.type === "self") {
        return (
          data.recipient === ZeroAddress &&
          data.sealingPair != null &&
          data.recipientSignature === "0x" &&
          data.issuerSignature !== "0x"
        );
      }
      return true;
    },
    {
      message:
        "For type 'self', issuerSignature must be populated, and recipient / recipientSignature empty.",
    },
  )
  .refine(
    (data) => {
      if (data.type === "sharing") {
        return (
          data.recipient !== ZeroAddress &&
          data.sealingPair == null &&
          data.recipientSignature === "0x" &&
          data.issuerSignature !== "0x"
        );
      }
      return true;
    },
    {
      message:
        "For type 'sharing', recipient / issuerSignature must be populated, and recipientSignature / sealingPair empty.",
    },
  )
  .refine(
    (data) => {
      if (data.type === "recipient") {
        return (
          data.recipient !== ZeroAddress &&
          data.sealingPair != null &&
          data.recipientSignature !== "0x" &&
          data.issuerSignature !== "0x"
        );
      }
      return true;
    },
    {
      message:
        "For type 'recipient', recipient / issuerSignature / recipientSignature must be populated.",
    },
  )
  .refine(
    (data) =>
      (data.validatorId !== 0 && data.validatorContract !== ZeroAddress) ||
      (data.validatorId === 0 && data.validatorContract === ZeroAddress),
    {
      message:
        "validatorId and validatorContract must either both be set or both be unset.",
    },
  );
