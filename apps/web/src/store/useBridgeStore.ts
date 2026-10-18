"use client";

import { create } from "zustand";
import {
  ComplexityLevel,
  RegisterMode,
  DeconstructedBridgePayload,
  DEMO_SCENARIOS,
  KinetixRealtimeBridge,
  BridgeEvent,
} from "@kinetix/shared";

export interface KinetixUser {
  name: string;
  email: string;
  role: string;
}

interface BridgeState {
  // Auth & Onboarding Flow State
  user: KinetixUser | null;
  hasCompletedOnboarding: boolean;
  onboardingStep: 1 | 2 | 3;
  showGuidedBanner: boolean;

  // Core Bridge State
  sessionId: string;
  isPaired: boolean;
  pairedDeviceName: string;
  scenarioId: "scholarship" | "tenancy" | "architecture" | "custom";
  rawInputText: string;
  voiceIntentTranscript: string;
  complexityLevel: ComplexityLevel;
  registerMode: RegisterMode;
  isDeconstructing: boolean;
  activeTelemetryStep: number;
  focusedNodeId: string | null;
  inspectingArtifactNodeId: string | null;
  isSimulatorOpen: boolean;
  lastLatencyMs: number;
  payload: DeconstructedBridgePayload;
  bridgeInstance: KinetixRealtimeBridge | null;

  // Auth & Onboarding Actions
  loginUser: (user: KinetixUser) => void;
  logoutUser: () => void;
  setOnboardingStep: (step: 1 | 2 | 3) => void;
  completeOnboarding: () => void;
  reopenOnboardingTour: () => void;
  dismissGuidedBanner: () => void;

  // Core Bridge Actions
  initBridge: (sessionId?: string) => void;
  setScenario: (id: "scholarship" | "tenancy" | "architecture") => void;
  setRawInputText: (text: string) => void;
  setVoiceIntentTranscript: (text: string) => void;
  setComplexityLevel: (
    level: ComplexityLevel,
    source?: "mobile" | "simulator" | "web"
  ) => void;
  setRegisterMode: (
    register: RegisterMode,
    source?: "mobile" | "simulator" | "web"
  ) => void;
  setFocusedNode: (nodeId: string | null) => void;
  setInspectingArtifactNode: (nodeId: string | null) => void;
  setSimulatorOpen: (open: boolean) => void;
  triggerDeconstruction: (
    overrideScenario?: "scholarship" | "tenancy" | "architecture"
  ) => Promise<void>;
}

export const useBridgeStore = create<BridgeState>((set, get) => ({
  user: null,
  hasCompletedOnboarding: false,
  onboardingStep: 1,
  showGuidedBanner: true,

  sessionId: "SHUNYA-8842",
  isPaired: true,
  pairedDeviceName: "PHONE-SCANNER-READY",
  scenarioId: "scholarship",
  rawInputText: DEMO_SCENARIOS.scholarship.rawDocumentSnippet,
  voiceIntentTranscript: DEMO_SCENARIOS.scholarship.sampleVoiceIntent,
  complexityLevel: 1,
  registerMode: "PLAIN",
  isDeconstructing: false,
  activeTelemetryStep: 0,
  focusedNodeId: "node-01",
  inspectingArtifactNodeId: null,
  isSimulatorOpen: true,
  lastLatencyMs: 14,
  payload: DEMO_SCENARIOS.scholarship.fallbackPayload,
  bridgeInstance: null,

  loginUser: (user) => set({ user, onboardingStep: 1 }),
  logoutUser: () =>
    set({ user: null, hasCompletedOnboarding: false, onboardingStep: 1 }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  completeOnboarding: () =>
    set({ hasCompletedOnboarding: true, showGuidedBanner: true }),
  reopenOnboardingTour: () =>
    set({ hasCompletedOnboarding: false, onboardingStep: 1 }),
  dismissGuidedBanner: () => set({ showGuidedBanner: false }),

  initBridge: (customSessionId) => {
    const existing = get().bridgeInstance;
    if (existing) existing.destroy();

    const targetSession = customSessionId || get().sessionId;
    const bridge = new KinetixRealtimeBridge(
      targetSession,
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    bridge.onEvent((event: BridgeEvent) => {
      const latency = Math.max(4, Math.min(42, Date.now() - event.timestamp));
      set({ lastLatencyMs: latency });

      switch (event.type) {
        case "BRIDGE_PAIR":
          set({
            isPaired: true,
            pairedDeviceName: event.deviceName,
          });
          break;
        case "COMPLEXITY_DIAL_CHANGE":
          set({ complexityLevel: event.level });
          break;
        case "REGISTER_MODE_CHANGE":
          set({ registerMode: event.register });
          break;
        case "NODE_FOCUS":
          set({ focusedNodeId: event.nodeId });
          break;
        case "INTENT_CAPTURED":
          set({
            scenarioId: event.scenarioId,
            rawInputText: event.rawText,
            voiceIntentTranscript: event.voiceIntentTranscript,
          });
          if (event.scenarioId !== "custom") {
            get().triggerDeconstruction(event.scenarioId);
          } else {
            get().triggerDeconstruction();
          }
          break;
        case "BRIDGE_COMPLETE":
          set({ payload: event.payload, isDeconstructing: false });
          break;
      }
    });

    set({ bridgeInstance: bridge, sessionId: targetSession });
  },

  setScenario: (id) => {
    const preset = DEMO_SCENARIOS[id];
    set({
      scenarioId: id,
      rawInputText: preset.rawDocumentSnippet,
      voiceIntentTranscript: preset.sampleVoiceIntent,
      payload: preset.fallbackPayload,
      focusedNodeId: preset.fallbackPayload.nodes[0]?.id ?? null,
    });
  },

  setRawInputText: (text) => set({ rawInputText: text, scenarioId: "custom" }),
  setVoiceIntentTranscript: (text) => set({ voiceIntentTranscript: text }),

  setComplexityLevel: (level, source = "web") => {
    set({ complexityLevel: level });
    const bridge = get().bridgeInstance;
    if (bridge && source !== "web") {
      bridge.emit({
        type: "COMPLEXITY_DIAL_CHANGE",
        sessionId: get().sessionId,
        level,
        source,
        timestamp: Date.now(),
      });
    }
  },

  setRegisterMode: (register, source = "web") => {
    set({ registerMode: register });
    const bridge = get().bridgeInstance;
    if (bridge && source !== "web") {
      bridge.emit({
        type: "REGISTER_MODE_CHANGE",
        sessionId: get().sessionId,
        register,
        source,
        timestamp: Date.now(),
      });
    }
  },

  setFocusedNode: (nodeId) => {
    set({ focusedNodeId: nodeId });
    const bridge = get().bridgeInstance;
    if (bridge && nodeId) {
      bridge.emit({
        type: "NODE_FOCUS",
        sessionId: get().sessionId,
        nodeId,
        timestamp: Date.now(),
      });
    }
  },

  setInspectingArtifactNode: (nodeId) =>
    set({ inspectingArtifactNodeId: nodeId }),

  setSimulatorOpen: (open) => set({ isSimulatorOpen: open }),

  triggerDeconstruction: async (overrideScenario) => {
    const state = get();
    const targetScenario = overrideScenario || state.scenarioId;
    set({ isDeconstructing: true, activeTelemetryStep: 0 });

    const stepTimer1 = setTimeout(() => set({ activeTelemetryStep: 1 }), 450);
    const stepTimer2 = setTimeout(() => set({ activeTelemetryStep: 2 }), 950);

    try {
      const res = await fetch("/api/deconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          scenarioId: targetScenario,
          rawText: state.rawInputText,
          voiceIntentTranscript: state.voiceIntentTranscript,
          initialComplexity: state.complexityLevel,
          initialRegister: state.registerMode,
        }),
      });

      const data = await res.json();
      await new Promise((r) => setTimeout(r, 1450));

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (data.payload) {
        set({
          payload: data.payload,
          isDeconstructing: false,
          focusedNodeId: data.payload.nodes[0]?.id ?? null,
        });
      } else {
        set({ isDeconstructing: false });
      }
    } catch {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      set({ isDeconstructing: false });
    }
  },
}));
