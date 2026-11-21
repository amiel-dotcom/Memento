"use client";

import { useEffect, type RefObject } from "react";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraOn: boolean;
  friendHere: boolean;
  remoteStream: MediaStream | null;
  roomError: string | null;
};

const stamp =
  "border-[1.5px] border-ink px-2 py-0.5 font-mono text-[10px] tracking-[0.2em]";

export default function GuestList({
  videoRef,
  cameraOn,
  friendHere,
  remoteStream,
  roomError,
}: Props) {
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = remoteStream;
  }, [remoteStream, videoRef]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs tracking-[0.25em]">THE GUEST LIST</p>
        <p className="font-mono text-xs tracking-[0.2em]">
          {friendHere ? 2 : 1} / 2
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">You</p>
          <p className="text-sm text-ink/60">
            {cameraOn ? "In the booth" : "Camera off"}
          </p>
        </div>
        <span className={stamp}>HERE</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">Your friend</p>
          <p className="text-sm text-ink/60">
            {!friendHere
              ? "Waiting to join"
              : remoteStream
              ? "In the booth"
              : "Joined, camera off"}
          </p>
        </div>
        {friendHere ? (
          <span className={stamp}>HERE</span>
        ) : (
          <span className="w-3 h-3 rounded-full bg-putty" />
        )}
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`mt-4 w-full aspect-[4/3] object-cover border-[1.5px] border-ink ${
          remoteStream ? "block" : "hidden"
        }`}
      />

      {roomError && (
        <p className="mt-4 border-[1.5px] border-ink px-3 py-2 text-sm font-semibold">
          {roomError}
        </p>
      )}
    </div>
  );
}