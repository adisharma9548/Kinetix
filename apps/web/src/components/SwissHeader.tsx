"use client";

import React from "react";
import { useBridgeStore } from "@/store/useBridgeStore";
import { ComplexityLevel, RegisterMode } from "@kinetix/shared";
import {
  Radio,
  Smartphone,
  Printer,
  Layers,
  ShieldCheck,
  HelpCircle,
  LogOut,
} from "lucide-react";

export function SwissHeader() {
  const {
    user,
    sessionId,
    complexityLevel,
    registerMode,
    lastLatencyMs,
    isSimulatorOpen,
    setComplexityLevel,
    setRegisterMode,
    setSimulatorOpen,
    reopenOnboardingTour,
    logoutUser,
  } = useBridgeStore();

  const complexityOptions: {
    level: ComplexityLevel;
    code: string;
    label: string;
    sub: string;
  }[] = [
    {
      level: 1,
      code: "1",
      label: "EXPLAIN SIMPLY",
      sub: "Like I'm 10 (Zero Jargon)",
    },
    {
      level: 2,
      code: "2",
      label: "ACTION PLAN",
      sub: "Step-by-Step Checklist",
    },
    {
      level: 3,
      code: "3",
      label: "READY-MADE DRAFTS",
      sub: "Auto-Written Letters & Code",
    },
  ];

  const registerOptions: { mode: RegisterMode; label: string }[] = [
    { mode: "PLAIN", label: "EVERYDAY ENGLISH" },
    { mode: "DIRECT", label: "SHORT BULLETS" },
    { mode: "STATUTORY", label: "FORMAL / LEGAL" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
      {/* Top Bar with User Info, How It Works Tour & Print Receipt */}
      <div className="bg-ink text-paper px-4 py-2 font-mono text-[11px] tracking-wider uppercase flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-signal font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse"/>
            KINETIX // DOCUMENT-TO-ACTION BRIDGE
          </span>
          <span className="hidden md:inline text-stone/80">
            SYNC ROOM: {sessionId} ({lastLatencyMs}MS)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reopenOnboardingTour}
            className="px-2.5 py-1 bg-signal text-paper font-bold flex items-center gap-1 hover:bg-stone hover:text-ink transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5"/>
            <span>HOW IT WORKS (TOUR)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-2.5 py-1 border border-stone/40 hover:border-signal flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5"/>
            <span>PRINT SUMMARY</span>
          </button>

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-stone/30">
              <span className="text-stone/90 hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={logoutUser}
                className="text-stone/70 hover:text-signal flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5"/>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Brand Title */}
        <div className="lg:col-span-3 p-4 border-b lg:border-b-0 lg:border-r border-ink flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase text-signal">
              PHONE + WEB CLARITY ENGINE
            </div>
            <h1 className="font-serif text-4xl tracking-tight leading-none mt-0.5">
              Kinetix <span className="italic font-normal">Bridge.</span>
            </h1>
          </div>
        </div>

        {/* 1-2-3 Simplicity Dial */}
        <div className="lg:col-span-5 p-3 border-b lg:border-b-0 lg:border-r border-ink bg-stone/60 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] uppercase font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-signal"/>
              STEP 2: CHOOSE SIMPLICITY LEVEL (1–2–3 DIAL)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {complexityOptions.map((opt) => {
              const active = complexityLevel === opt.level;
              return (
                <button
                  key={opt.level}
                  onClick={() => setComplexityLevel(opt.level, "web")}
                  className={`tactile-btn border-2 border-ink px-2.5 py-2 text-left transition-colors ${
                    active
                      ? "bg-signal text-paper shadow-tactile-sm font-bold"
                      : "bg-paper text-ink hover:bg-stone"
                  }`}
                >
                  <div className="font-mono text-xs font-bold">
                    {opt.code}. {opt.label}
                  </div>
                  <div className="font-sans text-[10px] opacity-85 truncate">
                    {opt.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Writing Tone + Virtual Phone Toggle */}
        <div className="lg:col-span-4 p-3 flex flex-col justify-between gap-2 bg-paper">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cobalt"/>
              WRITING TONE
            </span>
            <button
              onClick={() => setSimulatorOpen(!isSimulatorOpen)}
              className={`tactile-btn px-2.5 py-1 border border-ink font-mono text-[11px] uppercase flex items-center gap-1.5 ${
                isSimulatorOpen
                  ? "bg-cobalt text-paper shadow-tactile-sm font-bold"
                  : "bg-stone text-ink"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5"/>
              {isSimulatorOpen ? "HIDE PHONE REMOTE" : "OPEN PHONE REMOTE"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {registerOptions.map((reg) => {
              const active = registerMode === reg.mode;
              return (
                <button
                  key={reg.mode}
                  onClick={() => setRegisterMode(reg.mode, "web")}
                  className={`border border-ink py-1.5 px-2 font-mono text-[11px] uppercase transition-all ${
                    active
                      ? "bg-ink text-paper font-bold"
                      : "bg-paper text-ink hover:bg-stone"
                  }`}
                >
                  {reg.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
