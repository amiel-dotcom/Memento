"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import RoomCodeTicket from "./RoomCodeTicket";
import Viewfinder from "./Viewfinder";
import SnapCountSwitch from "./SnapCountSwitch";
import ThemePicker from "./ThemePicker";
import CollageModal from "./CollageModal";
import GuestList from "./GuestList";
import { THEMES } from "../lib/themes";
import { buildCollage } from "../lib/collage";
import { snapshot } from "../lib/capture";
import { usePeerRoom, type RoomMsg } from "../hooks/usePeerRoom";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pad = (n: number) => String(n).padStart(2, "0");

export default function RoomClient() {
  const params = useParams<{ code: string }>();
  const code = (params.code ?? "").toUpperCase();

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const busyRef = useRef(false);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snaps, setSnaps] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [total, setTotal] = useState(4);
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [built, setBuilt] = useState<{ src: string[]; url: string } | null>(null);
  const [dismissedFor, setDismissedFor] = useState<string[] | null>(null);

  const {
    friendHere,
    remoteStream,
    error: roomError,
    isHost,
    send,
  } = usePeerRoom(code, stream, handleMessage);

  const busy = countdown !== null;
  const full = snaps.length >= total;
  const locked = busy || snaps.length > 0;
  const collageUrl = built && built.src === snaps ? built.url : null;
  const modalOpen = !!collageUrl && dismissedFor !== snaps;

  function handleMessage(m: RoomMsg) {
    if (m.type === "snap") {
      if (stream && !full) runSnap();
    } else if (m.type === "reset") {
      setSnaps([]);
    } else if (m.type === "settings") {
      setTotal(m.total);
      setThemeId(m.themeId);
    }
  }

  // host sends the current settings when the friend joins
  useEffect(() => {
    if (isHost && friendHere) send({ type: "settings", total, themeId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, friendHere]);

  async function startCamera() {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      setStream(s);
    } catch {
      setError("Camera blocked. Allow camera access in your browser, then try again.");
    }
  }

  useEffect(() => {
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [stream]);

  useEffect(() => {
    if (!full) return;
    let cancelled = false;
    const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
    buildCollage(snaps, theme, code).then((url) => {
      if (!cancelled) setBuilt({ src: snaps, url });
    });
    return () => {
      cancelled = true;
    };
  }, [full, snaps, themeId, code]);

  function capture() {
    const local = videoRef.current;
    if (!local) return;
    const url = snapshot(local, remoteVideoRef.current);
    if (!url) return;
    setSnaps((prev) => [...prev, url]);
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  }

  async function runSnap() {
    if (busyRef.current) return;
    busyRef.current = true;
    for (let n = 3; n >= 1; n--) {
      setCountdown(n);
      await sleep(1000);
    }
    setCountdown(null);
    capture();
    busyRef.current = false;
  }

  function takeSnap() {
    if (!stream || busyRef.current || full) return;
    send({ type: "snap" });
    runSnap();
  }

  function changeTotal(n: number) {
    setTotal(n);
    send({ type: "settings", total: n, themeId });
  }

  function changeTheme(id: string) {
    setThemeId(id);
    send({ type: "settings", total, themeId: id });
  }

  function startOver() {
    setSnaps([]);
    send({ type: "reset" });
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* white flash */}
      <div
        className={`fixed inset-0 z-[60] bg-white pointer-events-none ${
          flash ? "opacity-100" : "opacity-0 transition-opacity duration-150"
        }`}
      />

      <header className="flex items-center justify-between border-b-[1.5px] border-ink pb-4">
        <Link href="/" className="font-display text-3xl leading-none">
          Memento
        </Link>
        <RoomCodeTicket code={code} />
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <Viewfinder
            videoRef={videoRef}
            stream={stream}
            error={error}
            onStart={startCamera}
            countdown={countdown}
          />

          <div className="mt-6 flex items-center justify-between">
            <p className="font-mono text-sm tracking-[0.2em]">
              FRAME {pad(snaps.length)} / {pad(total)}
            </p>

            <button
              onClick={takeSnap}
              disabled={!stream || busy || full}
              aria-label="Take photo"
              className="w-20 h-20 rounded-full border-[1.5px] border-ink bg-vermilion shadow-hard transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-40 disabled:pointer-events-none"
            />

            <div className="w-[120px] flex justify-end">
              {snaps.length > 0 && !busy && (
                <button
                  onClick={startOver}
                  className="font-mono text-xs tracking-[0.2em] underline underline-offset-4"
                >
                  START OVER
                </button>
              )}
            </div>
          </div>

          <div
            className="mt-6 grid gap-3"
            style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`aspect-[4/3] overflow-hidden flex items-center justify-center border-[1.5px] ${
                  snaps[i] ? "border-ink" : "border-dashed border-putty"
                }`}
              >
                {snaps[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={snaps[i]}
                    alt={`Snap ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display text-2xl text-putty">{pad(i + 1)}</span>
                )}
              </div>
            ))}
          </div>

          {collageUrl && !modalOpen && (
            <button
              onClick={() => setDismissedFor(null)}
              className="mt-6 border-[1.5px] border-ink bg-ink text-paper px-8 py-4 text-lg font-bold shadow-hard transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              View strip
            </button>
          )}
        </section>

        <aside className="self-start bg-white border-[1.5px] border-ink shadow-hard p-5">
          <GuestList
            videoRef={remoteVideoRef}
            cameraOn={!!stream}
            friendHere={friendHere}
            remoteStream={remoteStream}
            roomError={roomError}
          />

          <div className="mt-6 border-t-[1.5px] border-dashed border-putty pt-6">
            <p className="font-mono text-xs tracking-[0.25em]">NUMBER OF SNAPS</p>
            <div className="mt-3">
              <SnapCountSwitch value={total} onChange={changeTotal} disabled={locked} />
            </div>
            {locked && (
              <p className="mt-2 font-mono text-[10px] tracking-[0.15em] text-ink/60">
                START OVER TO CHANGE
              </p>
            )}

            <p className="mt-8 font-mono text-xs tracking-[0.25em]">PICK A BACKDROP</p>
            <div className="mt-3">
              <ThemePicker value={themeId} onChange={changeTheme} />
            </div>
          </div>
        </aside>
      </div>

      {modalOpen && collageUrl && (
        <CollageModal
          url={collageUrl}
          code={code}
          onClose={() => setDismissedFor(snaps)}
        />
      )}
    </main>
  );
}