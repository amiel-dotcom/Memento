"use client";

import { useEffect } from "react";

type Props = {
  url: string;
  code: string;
  onClose: () => void;
};

export default function CollageModal({ url, code, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm max-h-full flex flex-col bg-paper border-[1.5px] border-ink shadow-hard"
      >
        <div className="flex items-center justify-between border-b-[1.5px] border-ink px-5 py-3 font-mono text-xs tracking-[0.25em]">
          <span>YOUR STRIP</span>
          <button onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="h-3 bg-ink" />
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Your photo strip"
              className="print-down block w-full border-x-[1.5px] border-b-[1.5px] border-ink"
            />
          </div>
        </div>

        <div className="border-t-[1.5px] border-dashed border-putty px-5 py-4">
          <a
            href={url}
            download={`Memento-${code}.png`}
            className="block w-full text-center border-[1.5px] border-ink bg-ink text-paper py-4 text-xl font-bold shadow-hard transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            Download Collage
          </a>
        </div>
      </div>
    </div>
  );
}