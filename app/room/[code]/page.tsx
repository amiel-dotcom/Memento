import { Suspense } from "react";
import RoomClient from "../../../components/RoomClient";

export default function RoomPage() {
  return (
    <Suspense fallback={null}>
      <RoomClient />
    </Suspense>
  );
}