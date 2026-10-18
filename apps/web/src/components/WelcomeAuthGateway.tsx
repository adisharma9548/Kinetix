"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useBridgeStore } from "@/store/useBridgeStore";
import {
  Smartphone,
  Sliders,
  FileCheck2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export function WelcomeAuthGateway() {
  const { loginUser, completeOnboarding } = useBridgeStore();
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student / Applicant");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.from(".welcome-reveal", {
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: containerRef }
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: name.trim() || "Alex Mercer",
      email: email.trim() || "alex@kinetix.bridge",
      role,
    });
  };

  const handleInstantJudgePass = () => {
    loginUser({
      name: "Devlympics Judge",
      email: "judge@shunya2026.nsut",
      role: "Evaluator // All Access",
    });
  };

  const handleDirectWorkspacePass = () => {
    loginUser({
      name: "Devlympics Judge",
      email: "judge@shunya2026.nsut",
      role: "Evaluator // All Access",
    });
    completeOnboarding();
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-paper text-ink swiss-grid-bg flex flex-col justify-between"
    >
      {/* Top Status Strip */}
      <div className="bg-ink text-paper px-6 py-2 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-signal inline-block" />
          <span className="font-bold">
            KINETIX // HUMAN-TO-SYSTEM CLARITY BRIDGE
          </span>
        </div>
        <span className="text-stone/80">
          DEVLYMPICS SHUNYA 2026 — THEME: &ldquo;BRIDGE THE GAP&rdquo;
        </span>
      </div>

      {/* Center Split Grid: Value Proposition (Left) + Login/Register (Right) */}
      <main className="max-w-7xl w-full mx-auto my-8 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT 7 COLUMNS: Crystal-Clear Explanation of What KINETIX Does */}
        <div className="lg:col-span-7 space-y-6">
          <div className="welcome-reveal inline-flex items-center gap-2 px-3 py-1 bg-stone border border-ink font-mono text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-signal"/>
            <span>What is Kinetix? (In Plain English)</span>
          </div>

          <h1 className="welcome-reveal font-serif text-5xl md:text-7xl leading-[0.98] tracking-tight">
            Turn confusing paperwork into{" "}
            <span className="italic text-signal underline decoration-ink">
              clear action steps.
            </span>
          </h1>

          <p className="welcome-reveal font-sans text-lg md:text-xl text-ink/80 leading-relaxed max-w-2xl">
            Every day, people lose scholarships, sign unfair apartment leases, or
            get stuck on technical forms because the rules are written in
            intimidating legal or bureaucratic jargon.{" "}
            <strong className="text-ink">KINETIX bridges that gap.</strong>
          </p>

          {/* 3 Visual Pillars: How It Works in 10 Seconds */}
          <div className="welcome-reveal grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-paper border-2 border-ink p-4 shadow-tactile">
              <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
                <span className="px-2 py-0.5 bg-ink text-paper">STEP 01</span>
                <Smartphone className="w-4 h-4 text-signal"/>
              </div>
              <h3 className="font-serif text-2xl mb-1">
                Scan With Your Phone
              </h3>
              <p className="text-xs text-ink/80 leading-relaxed">
                Point your phone (or our built-in Virtual Phone) at a dense
                scholarship PDF, rental contract, or technical spec and ask your
                question aloud.
              </p>
            </div>

            <div className="bg-paper border-2 border-ink p-4 shadow-tactile">
              <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
                <span className="px-2 py-0.5 bg-signal text-paper">STEP 02</span>
                <Sliders className="w-4 h-4 text-ink"/>
              </div>
              <h3 className="font-serif text-2xl mb-1">
                Turn the 1–2–3 Dial
              </h3>
              <p className="text-xs text-ink/80 leading-relaxed">
                Slide between <strong>1: Explain Like I&apos;m 10</strong>,{" "}
                <strong>2: Action Checklist</strong>, and{" "}
                <strong>3: Auto-Write My Forms</strong>. Watch the screen morph
                live.
              </p>
            </div>

            <div className="bg-paper border-2 border-ink p-4 shadow-tactile">
              <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
                <span className="px-2 py-0.5 bg-cobalt text-paper">STEP 03</span>
                <FileCheck2 className="w-4 h-4 text-cobalt"/>
              </div>
              <h3 className="font-serif text-2xl mb-1">
                Copy &amp; Print Replies
              </h3>
              <p className="text-xs text-ink/80 leading-relaxed">
                Get ready-to-sign scholarship affidavits, legal counter-notices
                for your landlord, or code fixes ready to copy or print in one
                click.
              </p>
            </div>
          </div>

          {/* Real Examples Included Box */}
          <div className="welcome-reveal bg-stone border-2 border-ink p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-mono text-xs font-bold uppercase text-ink">
                PRE-LOADED WITH 3 REAL-WORLD CASES TO TEST IMMEDIATELY:
              </div>
              <div className="text-xs text-ink/80 mt-1">
                1. Government Scholarship Gazette &bull; 2. Predatory Apartment
                Lease &bull; 3. Double-Charge Payment Bug RFC
              </div>
            </div>
            <span className="font-mono text-[11px] px-2.5 py-1 bg-ledger text-paper font-bold">
              POWERED BY GEMINI 2.5 FLASH
            </span>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: Register / Login + 1-Click Judge Pass */}
        <div className="lg:col-span-5 welcome-reveal">
          <div className="bg-paper border-2 border-ink shadow-tactile p-6 md:p-8">
            {/* Fast-Track Judge Buttons */}
            <div className="mb-6 pb-6 border-b-2 border-ink space-y-2.5">
              <div className="font-mono text-[11px] uppercase font-bold text-signal mb-1">
                EVALUATING AT DEVLYMPICS SHUNYA 2026?
              </div>
              <button
                type="button"
                onClick={handleInstantJudgePass}
                className="w-full tactile-btn py-3 px-4 bg-signal text-paper border-2 border-ink font-mono text-xs font-bold uppercase shadow-tactile-sm flex items-center justify-center gap-2 hover:bg-ink transition-colors"
              >
                <UserCheck className="w-4 h-4"/>
                <span>1-CLICK JUDGE PASS (WITH 30s TOUR)</span>
                <ArrowRight className="w-4 h-4"/>
              </button>
              <button
                type="button"
                onClick={handleDirectWorkspacePass}
                className="w-full tactile-btn py-2.5 px-4 bg-stone text-ink border-2 border-ink font-mono text-xs font-bold uppercase shadow-tactile-sm flex items-center justify-center gap-2 hover:bg-ledger hover:text-paper transition-colors"
              >
                <Sparkles className="w-4 h-4 text-signal"/>
                <span>DIRECT WORKSPACE ACCESS (SKIP TOUR) &rarr;</span>
              </button>
            </div>

            {/* Mode Switcher: Create Account vs Sign In */}
            <div className="grid grid-cols-2 border-2 border-ink mb-5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`py-2.5 uppercase font-bold ${
                  authMode === "register"
                    ? "bg-ink text-paper"
                    : "bg-stone text-ink"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`py-2.5 uppercase font-bold ${
                  authMode === "login"
                    ? "bg-ink text-paper"
                    : "bg-stone text-ink"
                }`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Sharma"
                    className="w-full p-3 bg-stone border border-ink font-sans text-sm focus:outline-none focus:bg-paper"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full p-3 bg-stone border border-ink font-sans text-sm focus:outline-none focus:bg-paper"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 bg-stone border border-ink font-sans text-sm focus:outline-none focus:bg-paper"
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="block font-mono text-xs uppercase font-bold mb-1">
                    What documents do you deal with most?
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 bg-stone border border-ink font-sans text-sm focus:outline-none"
                  >
                    <option value="Student // Scholarships & Grants">
                      Student (Scholarships, College Forms &amp; Grants)
                    </option>
                    <option value="Tenant // Leases & Legal Contracts">
                      Tenant / Citizen (Leases, Legal &amp; Bank Contracts)
                    </option>
                    <option value="Engineer // System Specs & RFCs">
                      Developer / Engineer (System Specs &amp; Incident RFCs)
                    </option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full tactile-btn py-3.5 px-4 bg-ink text-paper border-2 border-ink font-mono text-xs font-bold uppercase shadow-tactile-sm flex items-center justify-center gap-2 hover:bg-signal transition-colors"
              >
                <ShieldCheck className="w-4 h-4"/>
                <span>
                  {authMode === "register"
                    ? "CREATE ACCOUNT & START INTERACTIVE TOUR"
                    : "SIGN IN & LAUNCH TOUR"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink bg-stone px-6 py-3 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
        <span>SWISS TACTILE INDUSTRIAL DESIGN SYSTEM</span>
        <span>PHONE SCANNER + WEB ACTION CANVAS SYNC</span>
      </footer>
    </div>
  );
}
