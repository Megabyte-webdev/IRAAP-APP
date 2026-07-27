import { X, Video } from "lucide-react";

interface MeetingPayload {
  msgType?: string;
  id?: number | string;
  meetingId?: string;
  title?: string;
  description?: string;
  meetingUrl?: string;
  scheduledAt?: string;
  duration?: number;
}

interface ReplyToData {
  id?: string | number;
  msgType?: string; // e.g. "CALL_INVITE" or "TEXT"
  content?: string;
  senderId?: number | string;
  sender?: {
    id?: number | string;
    fullName?: string;
    role?: string;
  };
  meeting?: MeetingPayload;
  media_type?: string;
  file_name?: string;
  media_urls?: string[];
}

interface ReplyPreviewProps {
  replyTo: ReplyToData;
  currentUserId?: number | string;
  recipientName?: string;
  onClose: () => void;
}

export default function SmartReplyPreview({
  replyTo,
  currentUserId,
  recipientName = "them",
  onClose,
}: ReplyPreviewProps) {
  const isSelf = Number(replyTo?.senderId) === Number(currentUserId);
  const isCallInvite =
    replyTo?.msgType === "CALL_INVITE" ||
    replyTo?.meeting?.msgType === "CALL_INVITE";

  // Extract display content based on payload
  const title =
    replyTo?.meeting?.title || replyTo?.content || "Call Invitation";

  // Format date string if present
  const scheduledTime = replyTo?.meeting?.scheduledAt
    ? new Date(replyTo.meeting.scheduledAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="relative mb-1 w-full px-3 pb-1 pt-1">
      <div
        className="flex items-center gap-3 rounded-[10px] bg-[#F4F4F4] px-3 py-2 transition-all"
        style={{
          borderLeft: isCallInvite ? "4px solid #3DA9EC" : "4px solid #b07b1b",
        }}
      >
        {/* Call Icon Badge */}
        {isCallInvite && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3DA9EC]/15 text-[#3DA9EC]">
            <Video size={16} />
          </div>
        )}

        {/* Details Container */}
        <div className="flex-1 overflow-hidden">
          <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            {isSelf ? "Replying to yourself" : `Replying to ${recipientName}`}
          </p>

          <p
            className={`line-clamp-1 text-xs ${
              isCallInvite ? "font-semibold text-[#3DA9EC]" : "text-gray-600"
            }`}
          >
            {isCallInvite ? `Meeting: ${title}` : title}
            {scheduledTime && (
              <span className="ml-1.5 font-normal text-gray-500 text-[11px]">
                ({scheduledTime})
              </span>
            )}
          </p>
        </div>

        {/* Close Action */}
        <button
          onClick={onClose}
          className="cursor-pointer rounded-full p-1.5 text-gray-500 transition-colors hover:bg-black/10"
          aria-label="Cancel reply"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
