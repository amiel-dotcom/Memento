"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const LENGTH = 6;

const clean = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, "");

export default function JoinModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [chars, setChars] = useState<string[]>(Array(LENGTH).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleChange(i: number, value: string) {
    const c = clean(value).slice(-1);
    const next = [...chars];
    next[i] = c;
    setChars(next);
    if (c && i < LENGTH - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      const next = [...chars];
      next[i - 1] = "";
      setChars(next);
      refs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = clean(e.clipboardData.getData("text")).slice(0, LENGTH);
    const next = Array(LENGTH).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));
    setChars(next);
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  }

  const code = chars.join("");
  const ready = code.length === LENGTH;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (ready) router.push(`/room/${code}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-ink/50 px-4 pt-[12vh] sm:pt-0"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-paper border-[1.5px] border-ink shadow-hard"
      >
        <div className="flex items-center justify-between border-b-[1.5px] border-ink px-4 sm:px-5 py-3 font-mono text-xs tracking-[0.25em]">
          <span>ADMIT TWO</span>
          <button type="button" onClick={onClose} aria-label="Close" className="px-2">
            ✕
          </button>
        </div>

        <div className="px-4 sm:px-5 pt-6 pb-5">
          <h2 className="font-display text-3xl sm:text-4xl leading-none">
            Enter your code
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            Ask your friend for the 6-character room code.
          </p>

          <div className="mt-6 flex gap-1.5 sm:gap-2">
            {chars.map((c, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={c}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                maxLength={2}
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="flex-1 min-w-0 h-14 sm:h-16 text-center font-mono text-xl sm:text-2xl uppercase bg-white border-[1.5px] border-ink focus:outline-none focus:bg-paper focus:shadow-hard"
              />
            ))}
          </div>
        </div>

        <div className="border-t-[1.5px] border-dashed border-putty px-4 sm:px-5 py-4">
          <button
            type="submit"
            disabled={!ready}
            className="w-full border-[1.5px] border-ink bg-ink text-paper py-3 font-semibold shadow-hard transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-40 disabled:pointer-events-none"
          >
            Join Room
          </button>
        </div>
      </form>
    </div>
  );
}