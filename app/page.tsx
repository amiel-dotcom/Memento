"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeRoomCode } from "../lib/roomCode";
import JoinModal from "../components/JoinModal";

const btnBase =
  "w-full sm:w-auto border-[1.5px] border-ink px-8 py-4 text-lg font-semibold shadow-hard transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

export default function Home() {
  const router = useRouter();
  const [joining, setJoining] = useState(false);

  function createRoom() {
    router.push(`/room/${makeRoomCode()}`);
  }

  return (
    <main className="min-h-svh flex items-center justify-center px-4 sm:px-6">
      <div className="text-center w-full">
        <h1 className="font-display text-6xl sm:text-8xl leading-none">
          Memento
        </h1>
        <p className="mt-4 text-base sm:text-lg text-ink/70">
          A tiny photo booth for two. Step in and snap.
        </p>

        <div className="mt-10 mx-auto max-w-xs sm:max-w-none flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={createRoom} className={`${btnBase} bg-ink text-paper`}>
            Create Room
          </button>
          <button
            onClick={() => setJoining(true)}
            className={`${btnBase} bg-paper text-ink`}
          >
            Join Room
          </button>
        </div>
      </div>

      {joining && <JoinModal onClose={() => setJoining(false)} />}
    </main>
  );
}