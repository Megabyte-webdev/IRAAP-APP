import WaitingScreen from "@/app/(dashboard)/student/(meeting)/_components/WaitingScreen";
import { getRoom } from "@/app/_lib/meta-function";
import { generatePageMetadata } from "@/app/_lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ meetingId?: string; userName?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const meetingId = sp?.meetingId;

  if (!meetingId) {
    return generatePageMetadata({
      title: "Joining Meeting — Invalid Link",
      description: "This meeting link is missing or invalid.",
    });
  }

  try {
    const roomData = await getRoom(meetingId);

    if (!roomData || roomData.valid === false) {
      return generatePageMetadata({
        title: "Joining Meeting — Meeting Not Found",
        description: "This meeting does not exist or has been removed.",
      });
    }

    return generatePageMetadata({
      title: roomData.name
        ? `Joining Meeting — ${roomData.name}`
        : "IRAAP Meet",
      description:
        roomData.description || "Join a secure, encrypted IRAAP meeting.",
    });
  } catch (err) {
    console.error("metadata error:", err);

    return generatePageMetadata({
      title: "IRAAP Meet",
      description: "Unable to load meeting details at this time.",
    });
  }
}
export default function WaitingRoomPage() {
  return <WaitingScreen />;
}
