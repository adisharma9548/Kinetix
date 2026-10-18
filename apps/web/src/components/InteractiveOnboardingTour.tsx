"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useBridgeStore } from "@/store/useBridgeStore";
import {
  Smartphone,
  Sliders,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function InteractiveOnboardingTour() {
  const {
    user,
    onboardingStep,
    setOnboardingStep,
    completeOnboarding,
    setComplexityLevel,
  } = useBridgeStore();

  const [sampleDial, setSampleDial] = useState<1 | 2 | 3>(1);
  const stepCardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stepCardRef.current) return;
      gsap.from(stepCardRef.current, {
        y: 16,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { dependencies: [onboardingStep] }
  );

  const handleSelectDialPreview = (lvl: 1 | 2 | 3) => {
    setSampleDial(lvl);
    setComplexityLevel(lvl, "web");
  };

  return (
    <div className="min-h-screen bg-paper text-ink swiss-grid-bg flex flex-col justify-between p-4 md:p-8">
      {/* Top Bar */}
      <div className="max-w-4xl w-full mx-auto bg-ink text-paper px-5 py-3 border-2 border-ink flex items-center justify-between font-mono text-xs">
        <div>
          WELCOME,{" "}
          <span className="text-signal font-bold uppercase">
            {user?.name || "EXPLORER"}
          </span>{" "}
          — QUICK 3-STEP PRODUCT TOUR
        </div>
        <button
          onClick={completeOnboarding}
          className="underline hover:text-signal uppercase font-bold"
        >
          Skip Tour &rarr; Go to App
        </button>
      </div>

      {/* Main Interactive Onboarding Card */}
      <div
        ref={stepCardRef}
        className="max-w-4xl w-full mx-auto my-6 bg-paper border-2 border-ink shadow-tactile p-6 md:p-10"
      >
        {/* Step Progress Pills */}
        <div className="grid grid-cols-3 gap-3 mb-8 font-mono text-xs">
          {[
            { step: 1, label: "01. PICK OR SCAN DOCUMENT" },
            { step: 2, label: "02. TRY THE 1-2-3 DIAL" },
            { step: 3, label: "03. COPY READY-MADE LETTERS" },
          ].map((item) => {
            const active = onboardingStep === item.step;
            const done = onboardingStep > item.step;
            return (
              <button
                key={item.step}
                onClick={() => setOnboardingStep(item.step as 1 | 2 | 3)}
                className={`p-3 border-2 border-ink text-left transition-all ${
                  active
                    ? "bg-signal text-paper font-bold shadow-tactile-sm"
                    : done
                    ? "bg-ink text-paper"
                    : "bg-stone text-ink/70"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* STEP 1 CONTENT */}
        {onboardingStep === 1 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone border border-ink font-mono text-xs font-bold">
              <Smartphone className="w-4 h-4 text-signal"/>
              STEP 1 OF 3: HOW INPUT WORKS
            </div>

            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              You don&apos;t have to read 20 pages of fine print anymore.
            </h2>

            <p className="text-base md:text-lg text-ink/80 leading-relaxed">
              On the left side of the workspace (or using the{" "}
              <strong>Virtual Phone</strong> in the bottom-right corner), you can
              pick one of our <strong>3 real-world documents</strong> or paste
              any confusing text and ask a normal question.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone p-5 border-2 border-ink">
              <div className="bg-paper p-4 border border-ink">
                <div className="font-mono text-xs font-bold text-signal uppercase mb-1">
                  BEFORE (Confusing Document)
                </div>
                <p className="font-mono text-xs text-ink/70 line-through">
                  &ldquo;Pursuant to Clause 4.2(b), applicants whose gross
                  familial emoluments do not exceed USD 65,000 shall submit
                  Annexure-IV attestation...&rdquo;
                </p>
              </div>
              <div className="bg-paper p-4 border border-ink">
                <div className="font-mono text-xs font-bold text-ledger uppercase mb-1">
                  AFTER (KINETIX Action Cards)
                </div>
                <p className="font-sans text-sm font-bold text-ink">
                  &ldquo;You qualify 100% for this $10,000/yr grant! Your
                  $42,000 family income is safely below the $65,000 limit.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 CONTENT: Interactive Live Dial Test */}
        {onboardingStep === 2 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone border border-ink font-mono text-xs font-bold">
              <Sliders className="w-4 h-4 text-signal"/>
              STEP 2 OF 3: TRY THE 1–2–3 SIMPLICITY DIAL RIGHT NOW
            </div>

            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              One document. Three levels of simplicity.
            </h2>

            <p className="text-base text-ink/80">
              Click the 3 buttons below right now to see how KINETIX morphs the
              exact same apartment lease trap depending on what you need:
            </p>

            {/* Interactive Mini Dial inside the Tour */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectDialPreview(1)}
                className={`tactile-btn p-4 border-2 border-ink text-left font-mono ${
                  sampleDial === 1
                    ? "bg-signal text-paper shadow-tactile-sm font-bold"
                    : "bg-stone text-ink"
                }`}
              >
                <div className="text-xs">DIAL 01</div>
                <div className="text-sm font-bold mt-1">
                  1. Explain Simply (ELI10)
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectDialPreview(2)}
                className={`tactile-btn p-4 border-2 border-ink text-left font-mono ${
                  sampleDial === 2
                    ? "bg-signal text-paper shadow-tactile-sm font-bold"
                    : "bg-stone text-ink"
                }`}
              >
                <div className="text-xs">DIAL 02</div>
                <div className="text-sm font-bold mt-1">
                  2. Step-by-Step Checklist
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectDialPreview(3)}
                className={`tactile-btn p-4 border-2 border-ink text-left font-mono ${
                  sampleDial === 3
                    ? "bg-signal text-paper shadow-tactile-sm font-bold"
                    : "bg-stone text-ink"
                }`}
              >
                <div className="text-xs">DIAL 03</div>
                <div className="text-sm font-bold mt-1">
                  3. Ready-to-Send Draft
                </div>
              </button>
            </div>

            {/* Live Morphing Output Box */}
            <div className="bg-stone border-2 border-ink p-5">
              {sampleDial === 1 && (
                <div>
                  <span className="font-mono text-xs bg-ink text-paper px-2 py-0.5 font-bold">
                    PREVIEWING DIAL 01: EXPLAIN LIKE I&apos;M 10
                  </span>
                  <h4 className="font-serif text-2xl mt-2">
                    &ldquo;Watch out! Moving out early costs you 5 months of
                    rent.&rdquo;
                  </h4>
                  <p className="text-sm mt-1 text-ink/80">
                    Even if the roof leaks, the landlord wants to keep your
                    3-month deposit plus charge 2 extra months. Don&apos;t sign
                    this yet!
                  </p>
                </div>
              )}
              {sampleDial === 2 && (
                <div>
                  <span className="font-mono text-xs bg-ink text-paper px-2 py-0.5 font-bold">
                    PREVIEWING DIAL 02: STEP-BY-STEP ACTION PLAN
                  </span>
                  <h4 className="font-serif text-2xl mt-2">
                    Clause 14.3 Audit &amp; Negotiation Steps
                  </h4>
                  <ul className="text-sm mt-2 space-y-1 font-medium list-disc list-inside">
                    <li>Reduce lock-in period from 11 months to 3 months.</li>
                    <li>Remove the 2-month extra penalty surcharge.</li>
                    <li>Add a 7-day leak repair guarantee or free exit.</li>
                  </ul>
                </div>
              )}
              {sampleDial === 3 && (
                <div>
                  <span className="font-mono text-xs bg-signal text-paper px-2 py-0.5 font-bold">
                    PREVIEWING DIAL 03: READY-TO-SEND LEGAL REPLACEMENT
                  </span>
                  <pre className="mt-2 bg-ink text-paper p-3 font-mono text-xs whitespace-pre-wrap">
                    {`AMENDED SECTION 14.3: "The initial Lock-In Period shall be strictly 3 months. Thereafter, either Party may terminate with 30 days' written notice and 100% Security Deposit refund upon key handover."`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 CONTENT */}
        {onboardingStep === 3 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone border border-ink font-mono text-xs font-bold">
              <FileText className="w-4 h-4 text-signal"/>
              STEP 3 OF 3: YOU ARE READY!
            </div>

            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Copy letters, listen to audio summaries, or print a physical
              receipt.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-stone border border-ink">
                <div className="font-mono text-xs font-bold uppercase text-signal">
                  1. LISTEN ALOUD
                </div>
                <p className="text-xs mt-1">
                  Click <strong>LISTEN</strong> on any card to have KINETIX read
                  the simplified explanation out loud with a live waveform.
                </p>
              </div>
              <div className="p-4 bg-stone border border-ink">
                <div className="font-mono text-xs font-bold uppercase text-cobalt">
                  2. VIRTUAL PHONE
                </div>
                <p className="text-xs mt-1">
                  Use the floating phone in the bottom-right corner to test how a
                  real mobile phone controls the web screen live.
                </p>
              </div>
              <div className="p-4 bg-stone border border-ink">
                <div className="font-mono text-xs font-bold uppercase text-ledger">
                  3. PRINT RECEIPT
                </div>
                <p className="text-xs mt-1">
                  Click <strong>PRINT RECEIPT</strong> in the top bar to generate
                  a clean 1-page action checklist you can carry to any office.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-8 pt-6 border-t-2 border-ink flex items-center justify-between">
          {onboardingStep > 1 ? (
            <button
              type="button"
              onClick={() =>
                setOnboardingStep((onboardingStep - 1) as 1 | 2 | 3)
              }
              className="tactile-btn px-4 py-2.5 border-2 border-ink bg-stone font-mono text-xs font-bold uppercase flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4"/>
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {onboardingStep < 3 ? (
            <button
              type="button"
              onClick={() =>
                setOnboardingStep((onboardingStep + 1) as 1 | 2 | 3)
              }
              className="tactile-btn px-6 py-3 border-2 border-ink bg-signal text-paper font-mono text-xs font-bold uppercase shadow-tactile-sm flex items-center gap-2"
            >
              <span>Next Step ({onboardingStep}/3)</span>
              <ArrowRight className="w-4 h-4"/>
            </button>
          ) : (
            <button
              type="button"
              onClick={completeOnboarding}
              className="tactile-btn px-8 py-3.5 border-2 border-ink bg-ledger text-paper font-mono text-sm font-bold uppercase shadow-tactile flex items-center gap-2 hover:bg-ink"
            >
              <Sparkles className="w-4 h-4"/>
              <span>LAUNCH KINETIX WORKSPACE NOW</span>
              <ArrowRight className="w-4 h-4"/>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto text-center font-mono text-xs text-ink/60">
        TIP: YOU CAN REOPEN THIS TOUR ANYTIME BY CLICKING &ldquo;[HOW IT
        WORKS]&rdquo; IN THE TOP HEADER.
      </div>
    </div>
  );
}
