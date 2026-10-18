import { z } from "zod";

export const ComplexityLevelSchema = z.union([
  z.literal(1), // 01: ELI10 / Fundamental Intuition
  z.literal(2), // 02: Executive Action Plan
  z.literal(3), // 03: Auto-Execute / Systemic Blueprint
]);
export type ComplexityLevel = z.infer<typeof ComplexityLevelSchema>;

export const RegisterModeSchema = z.enum([
  "PLAIN",     // Accessible everyday English
  "DIRECT",    // Crisp operational bullet-point English
  "STATUTORY", // Formal legal/technical specification English
]);
export type RegisterMode = z.infer<typeof RegisterModeSchema>;

export const TierContentSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  registerVariants: z.object({
    PLAIN: z.string(),
    DIRECT: z.string(),
    STATUTORY: z.string(),
  }),
  actionableBullets: z.array(z.string()),
  audioScript: z.string(),
  autoDraftedArtifact: z.object({
    artifactType: z.enum([
      "APPLICATION_LETTER",
      "LEGAL_COUNTER_NOTICE",
      "SYSTEM_SCRIPT",
      "CHECKLIST_PROTOCOL",
    ]),
    title: z.string(),
    bodyContent: z.string(),
  }),
});
export type TierContent = z.infer<typeof TierContentSchema>;

export const ExecutionNodeSchema = z.object({
  id: z.string(),
  indexLabel: z.string(), // "01", "02", "03"
  category: z.enum([
    "ELIGIBILITY",
    "RISK_TRAP",
    "DOCUMENT_REQ",
    "ACTION_GATE",
    "EXECUTION_PAYLOAD",
  ]),
  status: z.enum(["VERIFIED", "WARNING", "CRITICAL_ACTION", "READY"]),
  confidenceScore: z.number().min(0).max(100),
  estimatedMinutes: z.number(),
  dependencies: z.array(z.string()),
  tiers: z.object({
    tier1_eli10: TierContentSchema,
    tier2_executive: TierContentSchema,
    tier3_autoExecute: TierContentSchema,
  }),
});
export type ExecutionNode = z.infer<typeof ExecutionNodeSchema>;

export const DeconstructedBridgePayloadSchema = z.object({
  dossierId: z.string(),
  title: z.string(),
  domainTag: z.string(),
  sourceComplexityScore: z.number().min(1).max(100),
  bridgedClarityScore: z.number().min(1).max(100),
  rawJargonCount: z.number(),
  estimatedTimeSavedMinutes: z.number(),
  telemetryLog: z.array(
    z.object({
      stepIndex: z.string(),
      phaseName: z.string(),
      rawTokenSample: z.string(),
      resolvedMeaning: z.string(),
      latencyMs: z.number(),
    })
  ),
  globalSummary: z.object({
    PLAIN: z.string(),
    DIRECT: z.string(),
    STATUTORY: z.string(),
  }),
  eligibilityChecklist: z.array(
    z.object({
      id: z.string(),
      criterion: z.string(),
      isMetByDefault: z.boolean(),
      clauseReference: z.string(),
    })
  ),
  nodes: z.array(ExecutionNodeSchema),
});
export type DeconstructedBridgePayload = z.infer<
  typeof DeconstructedBridgePayloadSchema
>;

export const DeconstructRequestSchema = z.object({
  sessionId: z.string(),
  scenarioId: z.enum(["scholarship", "tenancy", "architecture", "custom"]),
  rawText: z.string().min(10),
  voiceIntentTranscript: z.string().optional(),
  initialComplexity: ComplexityLevelSchema.default(2),
  initialRegister: RegisterModeSchema.default("DIRECT"),
});
export type DeconstructRequest = z.infer<typeof DeconstructRequestSchema>;

// Realtime Broadcast Event Contracts
export const BridgeEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("BRIDGE_PAIR"),
    sessionId: z.string(),
    deviceName: z.string(),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal("INTENT_CAPTURED"),
    sessionId: z.string(),
    scenarioId: z.enum(["scholarship", "tenancy", "architecture", "custom"]),
    rawText: z.string(),
    voiceIntentTranscript: z.string(),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal("COMPLEXITY_DIAL_CHANGE"),
    sessionId: z.string(),
    level: ComplexityLevelSchema,
    source: z.enum(["mobile", "simulator", "web"]),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal("REGISTER_MODE_CHANGE"),
    sessionId: z.string(),
    register: RegisterModeSchema,
    source: z.enum(["mobile", "simulator", "web"]),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal("NODE_FOCUS"),
    sessionId: z.string(),
    nodeId: z.string(),
    tiltX: z.number().optional(),
    tiltY: z.number().optional(),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal("BRIDGE_COMPLETE"),
    sessionId: z.string(),
    payload: DeconstructedBridgePayloadSchema,
    timestamp: z.number(),
  }),
]);
export type BridgeEvent = z.infer<typeof BridgeEventSchema>;
