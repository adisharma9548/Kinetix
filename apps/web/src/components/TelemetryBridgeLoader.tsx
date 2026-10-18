"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useBridgeStore } from "@/store/useBridgeStore";
import { Cpu, ArrowRight, CheckCircle2, Terminal } from "lucide-react";

export function TelemetryBridgeLoader() {
  const { payload, activeTelemetryStep } = useBridgeStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".telemetry-card",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.45,
          ease: "power3.out",
        }
      );

      gsap.to(".telemetry-scan-bar", {
        xPercent: 100,
        repeat: -1,
        duration: 1.1,
        ease: "linear",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="border-2 border-ink bg-stone p-6 shadow-tactile my-6 relative overflow-hidden"
    >
      {/* Animated Schematic Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-signal text-paper border border-ink flex items-center justify-center shadow-tactile-sm">
            <Cpu className="w-5 h-5 animate-spin"/>
          </div>
          <div>
            <div className="font-mono text-xs uppercase font-bold text-signal">
              [LIVE TELEMETRY & DECONSTRUCTION BRIDGE ACTIVE]
            </div>
            <h3 className="font-serif text-2xl">
              Stripping bureaucratic opacity into executable nodes...
            </h3>
          </div>
        </div>
        <div className="font-mono text-xs bg-ink text-paper px-3 py-1.5">
          STAGE 0{activeTelemetryStep + 1} / 03 // GEMINI-2.5-FLASH
        </div>
      </div>

      {/* Scanning Laser Hairline */}
      <div className="w-full h-2 bg-paper border border-ink mb-6 overflow-hidden relative">
        <div className="telemetry-scan-bar w-1/2 h-full bg-signal -translate-x-full" />
      </div>

      {/* Interactive Deconstruction Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {payload.telemetryLog.map((item, idx) => {
          const isCompleted = idx <= activeTelemetryStep;
          return (
            <div
              key={item.stepIndex}
              className={`telemetry-card border border-ink p-4 transition-colors ${
                isCompleted ? "bg-paper shadow-tactile-sm" : "bg-stone/60 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="font-bold px-1.5 py-0.5 bg-ink text-paper">
                  {item.stepIndex} // {item.phaseName}
                </span>
                <span className="text-ledger font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5"/>
                  {item.latencyMs}ms
                </span>
              </div>

              <div className="mt-3 p-2 bg-stone border border-ink/40 font-mono text-[11px] line-through text-ink/70">
                RAW: &ldquo;{item.rawTokenSample}&rdquo;
              </div>

              <div className="my-2 flex items-center gap-1 font-mono text-[10px] uppercase text-signal font-bold">
                <ArrowRight className="w-3 h-3"/>
                RESOLVED EXECUTION MEANING
              </div>

              <div className="p-2.5 bg-paper border border-ink font-sans text-xs font-semibold text-ink">
                {item.resolvedMeaning}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-ink/30 flex items-center justify-between font-mono text-[11px] text-ink/70">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5"/>
          SCHEMA ENFORCEMENT: STRICT ZOD + GEMINI RESPONSE_SCHEMA
        </span>
        <span>ZERO-SPINNER TELEMETRY PROTOCOL</span>
      </div>
    </div>
  );
}
