"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Volume2, Square } from "lucide-react";

export function AudioSynthesizerDeck({
  activeSpeech,
  onStop,
}: {
  activeSpeech: { text: string; label: string } | null;
  onStop: () => void;
}) {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll(".eq-bar");

    if (activeSpeech) {
      const tween = gsap.to(bars, {
        scaleY: () => 0.25 + Math.random() * 0.75,
        duration: 0.18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.03,
      });
      return () => {
        tween.kill();
      };
    } else {
      gsap.to(bars, { scaleY: 0.15, duration: 0.2 });
    }
  }, [activeSpeech]);

  if (!activeSpeech) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-ink text-paper border-2 border-signal p-4 shadow-tactile max-w-md w-full">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 font-mono text-xs text-signal font-bold uppercase">
          <Volume2 className="w-4 h-4 animate-bounce" />
          <span>VOICE SYNTHESIS // {activeSpeech.label}</span>
        </div>
        <button
          onClick={onStop}
          className="px-2 py-1 bg-signal text-paper font-mono text-[10px] uppercase font-bold flex items-center gap-1"
        >
          <Square className="w-3 h-3" />
          STOP
        </button>
      </div>

      <p className="font-sans text-xs text-stone/90 line-clamp-2 mb-3">
        &ldquo;{activeSpeech.text}&rdquo;
      </p>

      {/* 16-Bar GSAP Equalizer */}
      <div
        ref={barsRef}
        className="h-6 flex items-end gap-1 pt-1 border-t border-stone/20"
      >
        {Array.from({ length: 16 }).map((_, idx) => (
          <div
            key={idx}
            className="eq-bar flex-1 bg-signal h-full origin-bottom"
            style={{ transform: "scaleY(0.2)" }}
          />
        ))}
      </div>
    </div>
  );
}
