"use client";

import React, { useEffect, useState } from "react";
import { useBridgeStore } from "@/store/useBridgeStore";
import { DEMO_SCENARIOS } from "@kinetix/shared";
import { WelcomeAuthGateway } from "@/components/WelcomeAuthGateway";
import { InteractiveOnboardingTour } from "@/components/InteractiveOnboardingTour";
import { SwissHeader } from "@/components/SwissHeader";
import { TelemetryBridgeLoader } from "@/components/TelemetryBridgeLoader";
import { ExecutionCanvas } from "@/components/ExecutionCanvas";
import { ArtifactInspectorModal } from "@/components/ArtifactInspectorModal";
import { VirtualFieldSimulator } from "@/components/VirtualFieldSimulator";
import { AudioSynthesizerDeck } from "@/components/AudioSynthesizerDeck";
import { PrintableSwissReceipt } from "@/components/PrintableSwissReceipt";
import {
  Sparkles,
  FileText,
  Mic,
  CheckSquare,
  Square,
  ArrowRight,
  ShieldAlert,
  X,
} from "lucide-react";

export default function KinetixStudioPage() {
  const {
    user,
    hasCompletedOnboarding,
    showGuidedBanner,
    dismissGuidedBanner,
    scenarioId,
    rawInputText,
    voiceIntentTranscript,
    registerMode,
    isDeconstructing,
    payload,
    initBridge,
    setScenario,
    setRawInputText,
    setVoiceIntentTranscript,
    triggerDeconstruction,
  } = useBridgeStore();

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeSpeech, setActiveSpeech] = useState<{
    text: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    initBridge("SHUNYA-8842");
  }, [initBridge]);

  useEffect(() => {
    const initialMap: Record<string, boolean> = {};
    payload.eligibilityChecklist.forEach((c) => {
      initialMap[c.id] = c.isMetByDefault;
    });
    setCheckedItems(initialMap);
  }, [payload.dossierId, payload.eligibilityChecklist]);

  const handleSpeakText = (text: string, label: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.02;
    utterance.onend = () => setActiveSpeech(null);
    setActiveSpeech({ text, label });
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeech(null);
  };

  // GATE 1: Welcome & Login/Registration Screen
  if (!user) {
    return <WelcomeAuthGateway />;
  }

  // GATE 2: 3-Step Interactive Product Onboarding Tour
  if (!hasCompletedOnboarding) {
    return <InteractiveOnboardingTour />;
  }

  // GATE 3: Main KINETIX Studio Workspace
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink swiss-grid-bg">
      <SwissHeader />

      {/* Dismissible Quick-Start Guide Strip at the top of the workspace */}
      {showGuidedBanner && (
        <div className="bg-stone border-b-2 border-ink px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-medium">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-signal text-paper uppercase">
              QUICK GUIDE
            </span>
            <span>
              <strong>Step 1 (Left):</strong> Pick a sample document below.
            </span>
            <span>&rarr;</span>
            <span>
              <strong>Step 2 (Top Bar or Phone):</strong> Click{" "}
              <em>1. Explain Simply</em>, <em>2. Action Plan</em>, or{" "}
              <em>3. Ready-Made Drafts</em>.
            </span>
            <span>&rarr;</span>
            <span>
              <strong>Step 3 (Right):</strong> Copy or print your ready-to-send
              letters!
            </span>
          </div>
          <button
            onClick={dismissGuidedBanner}
            className="font-mono text-xs underline flex items-center gap-1 hover:text-signal"
          >
            <X className="w-3.5 h-3.5" />
            Got it
          </button>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 border-x border-ink bg-paper/95">
        {/* LEFT COLUMN: Step 1 — Pick or Paste Your Confusing Document */}
        <section className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-ink p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-ink pb-4">
              <div className="font-mono text-xs uppercase font-bold text-signal mb-1">
                STEP 1 // DOCUMENT &amp; QUESTION INPUT
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                What document do you need help with today?
              </h2>
            </div>

            {/* 3 Clear Real-World Example Buttons */}
            <div>
              <div className="font-mono text-xs uppercase font-bold mb-2 flex items-center justify-between">
                <span>CHOOSE A SAMPLE DOCUMENT TO TEST:</span>
                <span className="text-signal">3 EXAMPLES READY</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(["scholarship", "tenancy", "architecture"] as const).map(
                  (key) => {
                    const preset = DEMO_SCENARIOS[key];
                    const active = scenarioId === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setScenario(key)}
                        className={`tactile-btn text-left p-3.5 border-2 border-ink transition-all ${
                          active
                            ? "bg-ink text-paper shadow-tactile-orange"
                            : "bg-stone text-ink hover:bg-paper shadow-tactile-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span
                            className={
                              active
                                ? "text-signal font-bold"
                                : "text-ink/70 font-bold"
                            }
                          >
                            [{preset.tag}]
                          </span>
                          <span>
                            {active ? "SELECTED" : "CLICK TO LOAD ->"}
                          </span>
                        </div>
                        <div className="font-serif text-xl mt-1">
                          {preset.label}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Raw Document Textarea */}
            <div>
              <label className="font-mono text-xs uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-signal" />
                CONFUSING DOCUMENT TEXT (OR PASTE YOUR OWN):
              </label>
              <textarea
                rows={5}
                value={rawInputText}
                onChange={(e) => setRawInputText(e.target.value)}
                className="w-full p-3.5 bg-stone border-2 border-ink font-mono text-xs leading-relaxed focus:outline-none focus:bg-paper"
              />
            </div>

            {/* User Question Input */}
            <div>
              <label className="font-mono text-xs uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-cobalt" />
                YOUR QUESTION OR GOAL:
              </label>
              <textarea
                rows={2}
                value={voiceIntentTranscript}
                onChange={(e) => setVoiceIntentTranscript(e.target.value)}
                className="w-full p-3 bg-paper border-2 border-ink font-sans text-sm font-medium focus:outline-none"
              />
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => triggerDeconstruction()}
              disabled={isDeconstructing}
              className="w-full tactile-btn py-4 px-6 bg-signal text-paper border-2 border-ink font-mono text-sm font-bold uppercase tracking-wider shadow-tactile flex items-center justify-center gap-2 hover:bg-ink transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isDeconstructing
                  ? "SIMPLIFYING DOCUMENT..."
                  : "SIMPLIFY DOCUMENT & WRITE MY ACTION PLAN"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Clear Metrics Footer */}
          <div className="mt-8 pt-6 border-t border-ink grid grid-cols-3 gap-3 font-mono">
            <div className="bg-stone p-3 border border-ink">
              <div className="text-[10px] text-ink/70">ORIGINAL DIFFICULTY</div>
              <div className="text-2xl font-bold text-signal">
                {payload.sourceComplexityScore}/100
              </div>
            </div>
            <div className="bg-stone p-3 border border-ink">
              <div className="text-[10px] text-ink/70">NEW CLARITY SCORE</div>
              <div className="text-2xl font-bold text-ledger">
                {payload.bridgedClarityScore}/100
              </div>
            </div>
            <div className="bg-stone p-3 border border-ink">
              <div className="text-[10px] text-ink/70">READING TIME SAVED</div>
              <div className="text-2xl font-bold text-ink">
                {payload.estimatedTimeSavedMinutes} mins
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Step 2 & 3 — Clear Answers, Checklists & Ready-to-Send Letters */}
        <section className="lg:col-span-7 p-6 md:p-8">
          <div className="border-2 border-ink bg-stone p-5 shadow-tactile mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs mb-2">
              <span className="px-2 py-0.5 bg-ink text-paper font-bold">
                SIMPLIFIED ACTION PLAN
              </span>
              <span className="text-signal font-bold">
                [{payload.domainTag}]
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl">{payload.title}</h2>

            {/* Bottom-Line Answer Box */}
            <div className="mt-4 p-4 bg-paper border-2 border-ink">
              <div className="font-mono text-xs uppercase font-bold text-cobalt mb-1">
                BOTTOM-LINE ANSWER TO YOUR QUESTION:
              </div>
              <p className="font-sans text-base font-semibold leading-relaxed">
                {payload.globalSummary[registerMode]}
              </p>
            </div>

            {/* Interactive Requirements Checklist */}
            <div className="mt-4 pt-4 border-t border-ink">
              <div className="font-mono text-xs uppercase font-bold mb-2.5 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-signal" />
                QUICK REQUIREMENTS CHECKLIST (CLICK TO CHECK OFF):
              </div>
              <div className="grid grid-cols-1 gap-2">
                {payload.eligibilityChecklist.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setCheckedItems((prev) => ({
                          ...prev,
                          [item.id]: !isChecked,
                        }))
                      }
                      className={`p-2.5 border border-ink text-left flex items-center justify-between gap-3 transition-colors ${
                        isChecked ? "bg-paper" : "bg-stone/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-ledger shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-signal shrink-0" />
                        )}
                        <span>{item.criterion}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-stone border border-ink shrink-0">
                        {item.clauseReference}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Loading Pipeline OR Step-by-Step Action Cards */}
          {isDeconstructing ? (
            <TelemetryBridgeLoader />
          ) : (
            <ExecutionCanvas onSpeakText={handleSpeakText} />
          )}

          {/* Printable 1-Page Summary Receipt */}
          <PrintableSwissReceipt />
        </section>
      </main>

      <ArtifactInspectorModal />
      <AudioSynthesizerDeck activeSpeech={activeSpeech} onStop={handleStopSpeech} />
      <VirtualFieldSimulator />
    </div>
  );
}
