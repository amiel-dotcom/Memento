"use client";

import { useState } from "react";

export default function RoomCodeTicket({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked, ignore
    }
  }

  return (
    <div className="flex items-stretch bg-white border-[1.5px] border-ink shadow-hard">
      <div className="px-4 py-2">
        <p className="font-mono text-[10px] tracking-[0.25em] text-ink/60">
          ROOM CODE
        </p>
        <p className="font-mono text-2xl font-bold tracking-[0.3em]">{code}</p>
      </div>
      <button
        onClick={copy}
        className="border-l-[1.5px] border-dashed border-ink px-4 font-mono text-xs tracking-[0.2em] hover:bg-paper active:bg-putty"
      >
        {copied ? "COPIED" : "COPY"}
      </button>
    </div>
  );
}