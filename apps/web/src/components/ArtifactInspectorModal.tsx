"use client";

import React, { useState } from "react";
import { useBridgeStore } from "@/store/useBridgeStore";
import { X, Copy, Check, Printer } from "lucide-react";

export function ArtifactInspectorModal() {
  const {
    payload,
    complexityLevel,
    inspectingArtifactNodeId,
    setInspectingArtifactNode,
  } = useBridgeStore();
  const [copied, setCopied] = useState(false);

  if (!inspectingArtifactNodeId) return null;

  const node = payload.nodes.find((n) => n.id === inspectingArtifactNodeId);
  if (!node) return null;

  const tier =
    complexityLevel === 1
      ? node.tiers.tier1_eli10
      : complexityLevel === 2
      ? node.tiers.tier2_executive
      : node.tiers.tier3_autoExecute;

  const artifact = tier.autoDraftedArtifact;

  const copyText = () => {
    navigator.clipboard.writeText(artifact.bodyContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4">
      <div className="bg-paper border-2 border-ink shadow-tactile max-w-3xl w-full overflow-hidden">
        <div className="bg-ink text-paper px-5 py-3 flex items-center justify-between font-mono text-xs">
          <span>
            [ARTIFACT INSPECTOR // NODE {node.indexLabel} //{" "}
            {artifact.artifactType}]
          </span>
          <button
            onClick={() => setInspectingArtifactNode(null)}
            className="hover:text-signal p-1"
          >
            <X className="w-4 h-4"/>
          </button>
        </div>

        <div className="p-6">
          <h3 className="font-serif text-3xl mb-2">{artifact.title}</h3>
          <p className="text-sm text-ink/70 mb-4">{tier.summary}</p>

          <pre className="bg-stone border-2 border-ink p-4 font-mono text-xs md:text-sm whitespace-pre-wrap max-h-[50vh] overflow-y-auto leading-relaxed">
            {artifact.bodyContent}
          </pre>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => window.print()}
              className="tactile-btn px-4 py-2 border border-ink bg-stone font-mono text-xs uppercase flex items-center gap-1.5 shadow-tactile-sm"
            >
              <Printer className="w-4 h-4"/>
              PRINT OFFICIAL DOSSIER
            </button>
            <button
              onClick={copyText}
              className="tactile-btn px-5 py-2 border border-ink bg-signal text-paper font-mono text-xs font-bold uppercase flex items-center gap-1.5 shadow-tactile-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4"/>
                  COPIED TO CLIPBOARD
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4"/>
                  COPY FULL PAYLOAD
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
