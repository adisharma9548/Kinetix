"use client";

import React from "react";
import { useBridgeStore } from "@/store/useBridgeStore";

export function PrintableSwissReceipt() {
  const { payload, complexityLevel, registerMode, sessionId } =
    useBridgeStore();

  return (
    <section
      id="kinetix-printable-receipt"
      className="mt-12 border-2 border-ink bg-paper p-6 md:p-8 shadow-tactile font-mono"
    >
      <div className="border-b-2 border-ink pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase text-signal">
            KINETIX // VERIFIED ACTION LEDGER RECEIPT
          </div>
          <h2 className="font-serif text-3xl text-ink mt-1">
            {payload.title}
          </h2>
        </div>
        <div className="text-right text-xs">
          <div>DOSSIER ID: {payload.dossierId}</div>
          <div>SESSION: {sessionId}</div>
          <div>
            MODE: TIER 0{complexityLevel} // {registerMode}
          </div>
        </div>
      </div>

      <div className="py-4 border-b border-ink text-xs leading-relaxed">
        <div className="font-bold uppercase mb-1">EXECUTIVE SUMMARY:</div>
        <p className="font-sans text-sm">
          {payload.globalSummary[registerMode]}
        </p>
      </div>

      <div className="py-4 border-b border-ink">
        <div className="text-xs font-bold uppercase mb-2">
          STATUTORY & TECHNICAL CHECKLIST:
        </div>
        <div className="space-y-1.5 text-xs">
          {payload.eligibilityChecklist.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>
                [{item.isMetByDefault ? "X" : " "}] {item.criterion}
              </span>
              <span className="font-bold">{item.clauseReference}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between text-[11px] uppercase">
        <span>ESTIMATED TIME SAVED: {payload.estimatedTimeSavedMinutes} MIN</span>
        <span>CLARITY SCORE: {payload.bridgedClarityScore}/100</span>
      </div>
    </section>
  );
}
