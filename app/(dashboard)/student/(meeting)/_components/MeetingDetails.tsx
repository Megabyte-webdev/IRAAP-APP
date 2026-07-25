import { getUserId } from "@/app/_lib/videosdk";
import { getAvatarColor, getInitials } from "@/app/_utils/formatters";
import { Key } from "react";

interface MeetingDetailsProps {
  meetingName: string;
  hostName: string;
  userName: string;
  isHost: boolean;
  isValidating: boolean;
  isOpen: boolean;
  roomId: string;
  preview: any;
}

export default function MeetingDetails({
  meetingName,
  hostName,
  userName,
  isHost,
  isValidating,
  isOpen,
  roomId,
  preview,
}: MeetingDetailsProps) {
  const userId = getUserId();
  const canJoin = isOpen || preview?.canJoin;

  const getSubheaderText = () => {
    if (isValidating) return "Setting up meeting...";

    // If they can join, but the room itself is locked/closed: welcome back!
    if (canJoin && !isOpen)
      return "You've already been approved. Welcome back!";

    if (canJoin) return "You can join this meeting instantly.";

    return "This meeting requires host approval before joining.";
  };

  return (
    <div className="text-center space-y-4">
      <p className="text-[#2D3319]/70 text-sm">{getSubheaderText()}</p>

      <h2 className="text-[#2D3319] font-bold text-2xl leading-tight">
        {meetingName}
      </h2>

      <div className="flex items-center justify-center gap-2 mt-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium shrink-0"
          style={{
            backgroundColor: getAvatarColor(userName),
          }}
        >
          {getInitials(userName)}
        </div>

        <div className="text-left">
          <p className="text-black text-sm">
            Hosted by{" "}
            <span className="font-semibold">{isHost ? "You" : hostName}</span>
          </p>

          <p className="text-[#2D3319]/70 text-sm">
            You are joining as <strong>{userName}</strong>
          </p>

          {preview?.count > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center -space-x-1.5">
                {preview.participants
                  .filter((p: { id: string | null }) => p.id !== userId)
                  .slice(0, 3)
                  .map(
                    (participant: {
                      id: Key | null | undefined;
                      name: string;
                    }) => (
                      <div
                        key={participant.id}
                        className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[8px] text-white"
                        style={{
                          backgroundColor: getAvatarColor(participant.name),
                        }}
                      >
                        {getInitials(participant.name)}
                      </div>
                    ),
                  )}

                {preview.count > 3 && (
                  <div className="w-5 h-5 rounded-full border border-white bg-[#2D3319]/10 flex items-center justify-center text-[8px]">
                    +{preview.count - 3}
                  </div>
                )}
              </div>

              <span className="text-xs text-[#2D3319]/60">
                {preview.count} currently in meeting
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
