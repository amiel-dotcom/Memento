"use client";

import { useEffect, useRef, useState } from "react";
import type { Peer, DataConnection } from "peerjs";

export type RoomMsg =
  | { type: "snap" }
  | { type: "reset" }
  | { type: "settings"; total: number; themeId: string };

export function usePeerRoom(
  code: string,
  localStream: MediaStream | null,
  onMessage: (m: RoomMsg) => void
) {
  const [friendId, setFriendId] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    let cancelled = false;
    let peer: Peer | null = null;

    async function start() {
      const { Peer } = await import("peerjs");
      if (cancelled) return;

      const hostId = `Memento-${code}`;

      const watch = (conn: DataConnection) => {
        connRef.current = conn;
        conn.on("open", () => setFriendId(conn.peer));
        conn.on("data", (d) => {
          if (d === "full") {
            setError("This room already has two people.");
            return;
          }
          if (d && typeof d === "object") onMessageRef.current(d as RoomMsg);
        });
        conn.on("close", () => {
          setFriendId(null);
          setRemoteStream(null);
        });
      };

      const listenForCalls = (p: Peer) => {
        p.on("call", (call) => {
          call.answer();
          call.on("stream", (s) => setRemoteStream(s));
          call.on("close", () => setRemoteStream(null));
        });
      };

      const host = new Peer(hostId);
      peer = host;
      peerRef.current = host;
      listenForCalls(host);

      host.on("connection", (conn) => {
        if (connRef.current?.open) {
          conn.on("open", () => {
            conn.send("full");
            setTimeout(() => conn.close(), 300);
          });
          return;
        }
        setIsHost(true);
        watch(conn);
      });

      host.on("error", (err) => {
        if (err.type === "unavailable-id") {
          host.destroy();
          const guest = new Peer();
          peer = guest;
          peerRef.current = guest;
          listenForCalls(guest);
          guest.on("open", () => watch(guest.connect(hostId)));
          guest.on("error", () =>
            setError("Could not connect. Check the code and try again.")
          );
        } else {
          setError("Connection problem. Refresh and try again.");
        }
      });
    }

    start();

    return () => {
      cancelled = true;
      peer?.destroy();
      peerRef.current = null;
      connRef.current = null;
    };
  }, [code]);

  useEffect(() => {
    const peer = peerRef.current;
    if (!peer || !friendId || !localStream) return;
    const call = peer.call(friendId, localStream);
    return () => call.close();
  }, [friendId, localStream]);

  function send(msg: RoomMsg) {
    const c = connRef.current;
    if (c && c.open) c.send(msg);
  }

  return { friendHere: friendId !== null, remoteStream, error, isHost, send };
}