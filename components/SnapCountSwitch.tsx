"use client";

import { SNAP_OPTIONS } from "../lib/themes";

type Props = {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
};

export default function SnapCountSwitch({ value, onChange, disabled }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Number of snaps"
      className={`inline-flex border-[1.5px] border-ink shadow-hard bg-paper ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {SNAP_OPTIONS.map((n, i) => {
        const active = n === value;
        return (
          <button
            key={n}
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(n)}
            className={`w-14 h-12 font-mono text-lg ${
              i > 0 ? "border-l-[1.5px] border-ink" : ""
            } ${
              active
                ? "bg-vermilion text-paper shadow-[inset_0_3px_0_rgba(0,0,0,0.25)]"
                : "bg-paper text-ink hover:bg-putty/50"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}