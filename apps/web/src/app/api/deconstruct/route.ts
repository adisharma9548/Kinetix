import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import {
  DeconstructRequestSchema,
  DeconstructedBridgePayloadSchema,
  DEMO_SCENARIOS,
} from "@kinetix/shared";

const tierContentGenSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    registerVariants: {
      type: Type.OBJECT,
      properties: {
        PLAIN: { type: Type.STRING },
        DIRECT: { type: Type.STRING },
        STATUTORY: { type: Type.STRING },
      },
      required: ["PLAIN", "DIRECT", "STATUTORY"],
    },
    actionableBullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    audioScript: { type: Type.STRING },
    autoDraftedArtifact: {
      type: Type.OBJECT,
      properties: {
        artifactType: {
          type: Type.STRING,
          enum: [
            "APPLICATION_LETTER",
            "LEGAL_COUNTER_NOTICE",
            "SYSTEM_SCRIPT",
            "CHECKLIST_PROTOCOL",
          ],
        },
        title: { type: Type.STRING },
        bodyContent: { type: Type.STRING },
      },
      required: ["artifactType", "title", "bodyContent"],
    },
  },
  required: [
    "headline",
    "summary",
    "registerVariants",
    "actionableBullets",
    "audioScript",
    "autoDraftedArtifact",
  ],
};

const bridgeResponseGenSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dossierId: { type: Type.STRING },
    title: { type: Type.STRING },
    domainTag: { type: Type.STRING },
    sourceComplexityScore: { type: Type.NUMBER },
    bridgedClarityScore: { type: Type.NUMBER },
    rawJargonCount: { type: Type.NUMBER },
    estimatedTimeSavedMinutes: { type: Type.NUMBER },
    telemetryLog: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepIndex: { type: Type.STRING },
          phaseName: { type: Type.STRING },
          rawTokenSample: { type: Type.STRING },
          resolvedMeaning: { type: Type.STRING },
          latencyMs: { type: Type.NUMBER },
        },
        required: [
          "stepIndex",
          "phaseName",
          "rawTokenSample",
          "resolvedMeaning",
          "latencyMs",
        ],
      },
    },
    globalSummary: {
      type: Type.OBJECT,
      properties: {
        PLAIN: { type: Type.STRING },
        DIRECT: { type: Type.STRING },
        STATUTORY: { type: Type.STRING },
      },
      required: ["PLAIN", "DIRECT", "STATUTORY"],
    },
    eligibilityChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          criterion: { type: Type.STRING },
          isMetByDefault: { type: Type.BOOLEAN },
          clauseReference: { type: Type.STRING },
        },
        required: ["id", "criterion", "isMetByDefault", "clauseReference"],
      },
    },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          indexLabel: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: [
              "ELIGIBILITY",
              "RISK_TRAP",
              "DOCUMENT_REQ",
              "ACTION_GATE",
              "EXECUTION_PAYLOAD",
            ],
          },
          status: {
            type: Type.STRING,
            enum: ["VERIFIED", "WARNING", "CRITICAL_ACTION", "READY"],
          },
          confidenceScore: { type: Type.NUMBER },
          estimatedMinutes: { type: Type.NUMBER },
          dependencies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          tiers: {
            type: Type.OBJECT,
            properties: {
              tier1_eli10: tierContentGenSchema,
              tier2_executive: tierContentGenSchema,
              tier3_autoExecute: tierContentGenSchema,
            },
            required: ["tier1_eli10", "tier2_executive", "tier3_autoExecute"],
          },
        },
        required: [
          "id",
          "indexLabel",
          "category",
          "status",
          "confidenceScore",
          "estimatedMinutes",
          "dependencies",
          "tiers",
        ],
      },
    },
  },
  required: [
    "dossierId",
    "title",
    "domainTag",
    "sourceComplexityScore",
    "bridgedClarityScore",
    "rawJargonCount",
    "estimatedTimeSavedMinutes",
    "telemetryLog",
    "globalSummary",
    "eligibilityChecklist",
    "nodes",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedReq = DeconstructRequestSchema.safeParse(body);

    if (!parsedReq.success) {
      return NextResponse.json(
        { error: "Invalid request contract", details: parsedReq.error.format() },
        { status: 400 }
      );
    }

    const { scenarioId, rawText, voiceIntentTranscript } = parsedReq.data;
    const apiKey = process.env.GEMINI_API_KEY;

    // Use live Gemini 2.5 Flash if API Key is configured and valid
    if (apiKey && !apiKey.includes("your-gemini-api-key")) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are the KINETIX Systemic Complexity Deconstruction Engine ("Bridge the Gap").
Convert dense bureaucratic, legal, financial, or technical source text plus the user's spoken intent into a structured 3-Tier Execution Graph in crisp, authoritative English.
- tier1_eli10: Fundamental intuition ("Explain like I am 10") with zero jargon.
- tier2_executive: High-leverage executive action plan citing exact clauses and operational steps.
- tier3_autoExecute: Complete, ready-to-use auto-drafted letters, legal redline riders, or production code patches inside autoDraftedArtifact.
- registerVariants: Provide PLAIN (accessible everyday English), DIRECT (crisp operational summary), and STATUTORY (precise legal/technical register) variants for every tier.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `SOURCE ARTIFACT:\n${rawText}\n\nUSER SPOKEN INTENT:\n${
                    voiceIntentTranscript || "Deconstruct this document into an actionable execution tree."
                  }`,
                },
              ],
            },
          ],
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: bridgeResponseGenSchema,
            temperature: 0.2,
          },
        });

        if (response.text) {
          const jsonOutput = JSON.parse(response.text);
          const validated = DeconstructedBridgePayloadSchema.parse(jsonOutput);
          return NextResponse.json({
            source: "gemini-2.5-flash-live",
            payload: validated,
          });
        }
      } catch (aiError) {
        console.warn("Gemini API fallback triggered:", aiError);
      }
    }

    // Deterministic Fallback Guarantee
    const presetKey =
      scenarioId === "custom" ? "scholarship" : scenarioId;
    const fallback = DEMO_SCENARIOS[presetKey].fallbackPayload;

    return NextResponse.json({
      source: "kinetix-deterministic-engine",
      payload: fallback,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Bridge Engine Error", message: String(err) },
      { status: 500 }
    );
  }
}
