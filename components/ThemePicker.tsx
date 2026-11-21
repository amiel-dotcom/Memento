"use client";

import { THEMES } from "../lib/themes";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export default function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {THEMES.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            className={`text-left p-2 bg-paper border-[1.5px] ${
              active
                ? "border-vermilion shadow-[3px_3px_0px_#D9381E]"
                : "border-ink shadow-hard"
            }`}
          >
            <div
              className="h-28 flex flex-col gap-1 p-2 border-[1.5px] border-ink"
              style={{ background: t.bg }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{
                    background: "#B8B0A0",
                    border: `3px solid ${t.photoBorder}`,
                  }}
                />
              ))}
              <div className="h-1 w-1/2" style={{ background: t.text }} />
            </div>
            <p
              className={`mt-2 font-mono text-[11px] tracking-[0.1em] ${
                active ? "text-vermilion" : "text-ink"
              }`}
            >
              {t.name.toUpperCase()}
            </p>
          </button>
        );
      })}
    </div>
  );
}