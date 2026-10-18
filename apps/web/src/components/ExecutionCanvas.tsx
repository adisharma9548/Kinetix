"use client";

import React, { useRef, useLayoutEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useBridgeStore } from "@/store/useBridgeStore";
import { ExecutionNode, TierContent } from "@kinetix/shared";
import {
  AlertTriangle,
  CheckCircle2,
  FileCode2,
  Clock,
  Volume2,
  ArrowUpRight,
  Copy,
  Check,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

interface CableCoord {
  id: string;
  d: string;
}

export function ExecutionCanvas({
  onSpeakText,
}: {
  onSpeakText: (text: string, label: string) => void;
}) {
  const {
    payload,
    complexityLevel,
    registerMode,
    focusedNodeId,
    setFocusedNode,
    setInspectingArtifactNode,
  } = useBridgeStore();

  const gridRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const [cables, setCables] = useState<CableCoord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute SVG Schematic Bezier Cables between node cards
  const recalculateCables = useCallback(() => {
    if (!gridRef.current) return;
    const containerRect = gridRef.current.getBoundingClientRect();
    const newCables: CableCoord[] = [];

    payload.nodes.forEach((node) => {
      const targetEl = gridRef.current?.querySelector(
        `[data-node-id="${node.id}"]`
      );
      if (!targetEl) return;
      const targetRect = targetEl.getBoundingClientRect();

      node.dependencies.forEach((depId) => {
        const sourceEl = gridRef.current?.querySelector(
          `[data-node-id="${depId}"]`
        );
        if (!sourceEl) return;
        const sourceRect = sourceEl.getBoundingClientRect();

        const x1 =
          sourceRect.left + sourceRect.width / 2 - containerRect.left;
        const y1 = sourceRect.bottom - containerRect.top;
        const x2 =
          targetRect.left + targetRect.width / 2 - containerRect.left;
        const y2 = targetRect.top - containerRect.top;

        const cY = (y1 + y2) / 2;
        const d = `M ${x1} ${y1} C ${x1} ${cY}, ${x2} ${cY}, ${x2} ${y2}`;
        newCables.push({ id: `${depId}->${node.id}`, d });
      });
    });

    setCables(newCables);
  }, [payload.nodes]);

  // Capture Flip state prior to complexity or register changes
  const captureLayoutState = () => {
    if (!gridRef.current) return;
    flipStateRef.current = Flip.getState(
      gridRef.current.querySelectorAll(".kinetix-node-card")
    );
  };

  useLayoutEffect(() => {
    if (!gridRef.current) return;

    if (flipStateRef.current) {
      Flip.from(flipStateRef.current, {
        duration: 0.55,
        ease: "power3.inOut",
        scale: false,
        nested: true,
        onComplete: recalculateCables,
      });
      flipStateRef.current = null;
    } else {
      gsap.fromTo(
        ".kinetix-node-card",
        { y: 14, opacity: 0.6 },
        {
          y: 0,
          opacity: 1,
          duration: 0.38,
          stagger: 0.07,
          ease: "power2.out",
          onComplete: recalculateCables,
        }
      );
    }
  }, [complexityLevel, registerMode, payload.dossierId, recalculateCables]);

  React.useEffect(() => {
    captureLayoutState();
  }, [complexityLevel, registerMode]);

  React.useEffect(() => {
    window.addEventListener("resize", recalculateCables);
    return () => window.removeEventListener("resize", recalculateCables);
  }, [recalculateCables]);

  const getActiveTier = (node: ExecutionNode): TierContent => {
    if (complexityLevel === 1) return node.tiers.tier1_eli10;
    if (complexityLevel === 2) return node.tiers.tier2_executive;
    return node.tiers.tier3_autoExecute;
  };

  const handleCopyArtifact = (nodeId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(nodeId);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="relative" ref={gridRef}>
      {/* Exposed SVG Schematic Connector Layer */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full z-0 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="kinetix-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#FF4F00" />
          </marker>
        </defs>
        {cables.map((cable) => (
          <g key={cable.id}>
            <path
              d={cable.d}
              fill="none"
              stroke="#111110"
              strokeWidth="3"
              opacity="0.2"
            />
            <path
              d={cable.d}
              fill="none"
              stroke="#FF4F00"
              strokeWidth="2"
              strokeDasharray="6 4"
              markerEnd="url(#kinetix-arrow)"
            />
          </g>
        ))}
      </svg>

      {/* Node Execution Grid */}
      <div
        className={`relative z-10 grid gap-6 ${
          complexityLevel === 1
            ? "grid-cols-1"
            : complexityLevel === 2
            ? "grid-cols-1 xl:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {payload.nodes.map((node) => {
          const tier = getActiveTier(node);
          const isFocused = focusedNodeId === node.id;
          const isWarning =
            node.status === "WARNING" || node.status === "CRITICAL_ACTION";

          return (
            <article
              key={node.id}
              data-node-id={node.id}
              data-flip-id={node.id}
              onClick={() => setFocusedNode(node.id)}
              className={`kinetix-node-card cursor-pointer border-2 border-ink bg-paper transition-shadow ${
                isFocused
                  ? "shadow-tactile-orange ring-2 ring-signal"
                  : "shadow-tactile hover:shadow-tactile-orange"
              }`}
            >
              {/* Card Top Stamped Index Bar */}
              <div
                className={`px-4 py-2.5 border-b border-ink flex flex-wrap items-center justify-between gap-2 font-mono text-xs ${
                  isWarning ? "bg-signal text-paper" : "bg-stone text-ink"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 bg-ink text-paper font-bold text-sm">
                    NODE {node.indexLabel}
                  </span>
                  <span className="font-bold uppercase tracking-wider">
                    [{node.category}]
                  </span>
                  {node.dependencies.length > 0 && (
                    <span className="text-[11px] opacity-80">
                      DEPENDS ON: {node.dependencies.join(", ").toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5"/>
                    {node.estimatedMinutes} MIN
                  </span>
                  <span className="px-2 py-0.5 border border-current font-bold flex items-center gap-1">
                    {isWarning ? (
                      <AlertTriangle className="w-3.5 h-3.5"/>
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5"/>
                    )}
                    {node.status} ({node.confidenceScore}%)
                  </span>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className={`font-serif leading-tight ${
                      complexityLevel === 1
                        ? "text-3xl md:text-4xl"
                        : "text-2xl md:text-3xl"
                    }`}
                  >
                    {tier.headline}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpeakText(tier.audioScript, tier.headline);
                    }}
                    className="tactile-btn shrink-0 px-3 py-1.5 border border-ink bg-stone hover:bg-signal hover:text-paper font-mono text-xs uppercase flex items-center gap-1.5 shadow-tactile-sm"
                    title="Synthesize Audio Explanation"
                  >
                    <Volume2 className="w-3.5 h-3.5"/>
                    <span>LISTEN</span>
                  </button>
                </div>

                {/* Active Register Callout */}
                <div className="mt-3 p-3 bg-stone/70 border-l-4 border-cobalt font-sans text-sm md:text-base text-ink leading-relaxed">
                  <span className="font-mono text-[10px] uppercase font-bold text-cobalt block mb-1">
                    [{registerMode} REGISTER ACTIVE]
                  </span>
                  {tier.registerVariants[registerMode] || tier.summary}
                </div>

                {/* Actionable Execution Bullets */}
                <ul className="mt-4 space-y-2">
                  {tier.actionableBullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm font-medium"
                    >
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-ink text-paper mt-0.5">
                        0{i + 1}
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Tier 3 or Inspectable Auto-Drafted Execution Artifact */}
                <div className="mt-5 pt-4 border-t border-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ledger">
                      <FileCode2 className="w-4 h-4"/>
                      <span>
                        AUTO-DRAFTED ARTIFACT: {tier.autoDraftedArtifact.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyArtifact(
                            node.id,
                            tier.autoDraftedArtifact.bodyContent
                          );
                        }}
                        className="tactile-btn px-2.5 py-1 border border-ink bg-paper hover:bg-stone font-mono text-[11px] uppercase flex items-center gap-1"
                      >
                        {copiedId === node.id ? (
                          <>
                            <Check className="w-3 h-3 text-ledger"/>
                            COPIED
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3"/>
                            COPY PAYLOAD
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectingArtifactNode(node.id);
                        }}
                        className="tactile-btn px-3 py-1 border border-ink bg-ink text-paper hover:bg-signal font-mono text-[11px] uppercase flex items-center gap-1"
                      >
                        <span>OPEN FULL ARTIFACT</span>
                        <ArrowUpRight className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>

                  {/* Inline Artifact Preview Box (Expanded automatically in Tier 3) */}
                  <pre
                    className={`font-mono text-xs bg-ink text-paper p-4 border border-ink overflow-x-auto whitespace-pre-wrap leading-relaxed ${
                      complexityLevel === 3 ? "max-h-96" : "max-h-32"
                    }`}
                  >
                    {tier.autoDraftedArtifact.bodyContent}
                  </pre>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
