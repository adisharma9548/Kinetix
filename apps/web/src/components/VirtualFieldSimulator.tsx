"use client";

import React, { useState } from "react";
import { useBridgeStore } from "@/store/useBridgeStore";
import {
  DEMO_SCENARIOS,
  ComplexityLevel,
  RegisterMode,
} from "@kinetix/shared";
import { QRCodeSVG } from "qrcode.react";
import {
  Camera,
  Mic,
  Sliders,
  QrCode,
  Sparkles,
  CheckCircle2,
  Minimize2,
} from "lucide-react";

export function VirtualFieldSimulator() {
  const {
    sessionId,
    scenarioId,
    complexityLevel,
    registerMode,
    voiceIntentTranscript,
    isSimulatorOpen,
    setSimulatorOpen,
    setScenario,
    setVoiceIntentTranscript,
    setComplexityLevel,
    setRegisterMode,
    triggerDeconstruction,
    setFocusedNode,
    payload,
  } = useBridgeStore();

  const [activeTab, setActiveTab] = useState<"scan" | "dial" | "qr">("dial");
  const [isRecordingSim, setIsRecordingSim] = useState(false);

  if (!isSimulatorOpen) return null;

  const triggerHapticPulse = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(18);
    }
  };

  const handleDialChange = (level: ComplexityLevel) => {
    triggerHapticPulse();
    setComplexityLevel(level, "simulator");
  };

  const handleScenarioInject = (
    id: "scholarship" | "tenancy" | "architecture"
  ) => {
    triggerHapticPulse();
    setScenario(id);
    triggerDeconstruction(id);
  };

  const simulateVoiceCapture = () => {
    triggerHapticPulse();
    setIsRecordingSim(true);
    setTimeout(() => {
      setIsRecordingSim(false);
      triggerDeconstruction();
    }, 1100);
  };

  return (
    <aside
      aria-label="Virtual Field Phone Simulator"
      className="fixed bottom-4 right-4 z-40 w-[340px] bg-stone border-2 border-ink shadow-tactile overflow-hidden"
    >
      {/* Top Industrial Hardware Bezel */}
      <div className="bg-ink text-paper px-3.5 py-2.5 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
          <span className="font-bold tracking-wider">
            FIELD NODE // TE-SIM-01
          </span>
        </div>
        <button
          onClick={() => setSimulatorOpen(false)}
          className="hover:text-signal p-0.5"
          title="Minimize Field Phone"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 border-b border-ink bg-paper font-mono text-[11px]">
        <button
          onClick={() => setActiveTab("dial")}
          className={`py-2 flex items-center justify-center gap-1 border-r border-ink uppercase ${
            activeTab === "dial" ? "bg-signal text-paper font-bold" : ""
          }`}
        >
          <Sliders className="w-3 h-3" />
          DIAL
        </button>
        <button
          onClick={() => setActiveTab("scan")}
          className={`py-2 flex items-center justify-center gap-1 border-r border-ink uppercase ${
            activeTab === "scan" ? "bg-signal text-paper font-bold" : ""
          }`}
        >
          <Camera className="w-3 h-3" />
          SCANNER
        </button>
        <button
          onClick={() => setActiveTab("qr")}
          className={`py-2 flex items-center justify-center gap-1 uppercase ${
            activeTab === "qr" ? "bg-signal text-paper font-bold" : ""
          }`}
        >
          <QrCode className="w-3 h-3" />
          PAIR QR
        </button>
      </div>

      {/* Tab 1: Tactile Complexity Scrubbing & Voice Intent */}
      {activeTab === "dial" && (
        <div className="p-4 space-y-4">
          <div className="bg-paper border border-ink p-3">
            <div className="font-mono text-[10px] uppercase font-bold text-ink/70 mb-2">
              TACTILE COMPLEXITY ROTARY (LIVE FLIP)
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {([1, 2, 3] as ComplexityLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleDialChange(lvl)}
                  className={`tactile-btn py-2.5 border border-ink font-mono text-xs font-bold ${
                    complexityLevel === lvl
                      ? "bg-signal text-paper shadow-tactile-sm"
                      : "bg-stone text-ink"
                  }`}
                >
                  0{lvl}
                  <span className="block text-[9px] font-normal mt-0.5">
                    {lvl === 1 ? "ELI10" : lvl === 2 ? "EXEC" : "AUTO"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Register Sync Switch */}
          <div className="bg-paper border border-ink p-3">
            <div className="font-mono text-[10px] uppercase font-bold text-ink/70 mb-2">
              SEMANTIC REGISTER OVERRIDE
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(["PLAIN", "DIRECT", "STATUTORY"] as RegisterMode[]).map(
                (reg) => (
                  <button
                    key={reg}
                    onClick={() => setRegisterMode(reg, "simulator")}
                    className={`py-1.5 border border-ink font-mono text-[10px] uppercase ${
                      registerMode === reg
                        ? "bg-ink text-paper font-bold"
                        : "bg-stone text-ink"
                    }`}
                  >
                    {reg}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Remote Node Focus Stepper */}
          <div className="bg-paper border border-ink p-3">
            <div className="font-mono text-[10px] uppercase font-bold text-ink/70 mb-2">
              REMOTE NODE FOCUS TRIGGER
            </div>
            <div className="flex gap-1.5">
              {payload.nodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setFocusedNode(n.id)}
                  className="flex-1 py-1.5 border border-ink bg-stone hover:bg-signal hover:text-paper font-mono text-xs font-bold"
                >
                  NODE {n.indexLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Intent Push-to-Talk */}
          <div className="bg-paper border border-ink p-3">
            <div className="font-mono text-[10px] uppercase font-bold text-ink/70 mb-1">
              SPOKEN INTENT CAPTURE
            </div>
            <textarea
              rows={2}
              value={voiceIntentTranscript}
              onChange={(e) => setVoiceIntentTranscript(e.target.value)}
              className="w-full bg-stone border border-ink p-2 font-sans text-xs focus:outline-none"
            />
            <button
              onClick={simulateVoiceCapture}
              className={`mt-2 w-full tactile-btn py-2 border border-ink font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 shadow-tactile-sm ${
                isRecordingSim
                  ? "bg-cobalt text-paper animate-pulse"
                  : "bg-signal text-paper"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              {isRecordingSim
                ? "TRANSMITTING INTENT..."
                : "BEAM INTENT TO WEB CANVAS"}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Camera Artifact Presets */}
      {activeTab === "scan" && (
        <div className="p-4 space-y-3">
          <div className="font-mono text-[10px] uppercase font-bold text-ink/70">
            SIMULATE FIELD CAMERA ARTIFACT SCAN
          </div>
          {(["scholarship", "tenancy", "architecture"] as const).map((key) => {
            const item = DEMO_SCENARIOS[key];
            const active = scenarioId === key;
            return (
              <button
                key={key}
                onClick={() => handleScenarioInject(key)}
                className={`w-full text-left p-2.5 border border-ink transition-all ${
                  active
                    ? "bg-ink text-paper shadow-tactile-sm"
                    : "bg-paper text-ink hover:bg-stone"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-signal font-bold">{item.tag}</span>
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-ledger" />}
                </div>
                <div className="font-serif text-base mt-0.5">{item.label}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 3: Live QR Session Pairing */}
      {activeTab === "qr" && (
        <div className="p-4 text-center space-y-3">
          <div className="font-mono text-[10px] uppercase font-bold">
            SCAN WITH EXPO MOBILE APP TO PAIR
          </div>
          <div className="bg-paper p-4 border border-ink inline-block mx-auto">
            <QRCodeSVG
              value={`kinetix://bridge?session=${sessionId}`}
              size={148}
              bgColor="#F4F1EA"
              fgColor="#111110"
            />
          </div>
          <div className="font-mono text-xs bg-ink text-paper py-1.5 px-3">
            ROOM ID: {sessionId}
          </div>
          <p className="font-sans text-[11px] text-ink/70">
            Connected over Supabase Realtime Channel{" "}
            <code className="font-mono">kinetix:bridge:{sessionId}</code>
          </p>
        </div>
      )}
    </aside>
  );
}
