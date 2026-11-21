"use client";

import { useEffect, type RefObject } from "react";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  error: string | null;
  onStart: () => void;
  countdown: number | null;
};

const tick = "absolute w-8 h-8 border-ink";

export default function Viewfinder({
  videoRef,
  stream,
  error,
  onStart,
  countdown,
}: Props) {
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream, videoRef]);

  const on = !!stream;
  const rec = countdown !== null;

  return (
    <div className="relative aspect-[4/3] w-full bg-putty/40 border-[1.5px] border-ink overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${
          on ? "block" : "hidden"
        }`}
      />

      {!on && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-display text-3xl">Your camera goes here</p>
          <p className="text-sm text-ink/70">
            {error ?? "Turn on your camera when you're ready."}
          </p>
          <button
            onClick={onStart}
            className="border-[1.5px] border-ink bg-ink text-paper px-6 py-3 font-semibold shadow-hard transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            Turn on camera
          </button>
        </div>
      )}

      {rec && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-paper border-[1.5px] border-ink shadow-hard px-8 py-3 font-mono text-8xl font-bold">
            {String(countdown).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* viewfinder tick marks */}
      <span className={`${tick} top-4 left-4 border-t-[1.5px] border-l-[1.5px]`} />
      <span className={`${tick} top-4 right-4 border-t-[1.5px] border-r-[1.5px]`} />
      <span className={`${tick} bottom-4 left-4 border-b-[1.5px] border-l-[1.5px]`} />
      <span className={`${tick} bottom-4 right-4 border-b-[1.5px] border-r-[1.5px]`} />

      {/* status pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-paper border-[1.5px] border-ink px-3 py-1 font-mono text-[11px] tracking-[0.2em]">
        <span
          className={`w-2 h-2 rounded-full ${
            rec ? "bg-vermilion" : on ? "bg-ink" : "bg-putty"
          }`}
        />
        {rec ? "REC" : on ? "READY" : "CAMERA OFF"}
      </div>
    </div>
  );
}