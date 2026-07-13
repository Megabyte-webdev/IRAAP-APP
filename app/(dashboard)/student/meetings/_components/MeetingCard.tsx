import { useEffect, useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { Meeting } from "@/app/_utils/types";
import { Calendar, Clock, User, Video, Timer } from "lucide-react";

const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
  const { authDetails } = useAuth();
  const CURRENT_USER = authDetails?.user;
  const isStudent = CURRENT_USER?.role === "STUDENT";
  const peer = isStudent
    ? meeting.participants.supervisor
    : meeting.participants.student;

  // Track the current time live (updates every second)
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Parse time constants
  const startTime = new Date(meeting.scheduledAt).getTime();
  const durationMs = meeting.duration * 60 * 1000;
  const endTime = startTime + durationMs;
  const currentTime = now.getTime();

  // Rules: Join window opens 10 minutes prior
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  const isJoinable =
    currentTime >= startTime - TEN_MINUTES_MS && currentTime <= endTime;
  const isExpired = currentTime > endTime;

  // Format Dates & Times
  const formattedDate = new Date(meeting.scheduledAt).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const formattedTime = new Date(meeting.scheduledAt).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  // Helper to build countdown string
  const getCountdownString = () => {
    const diff = startTime - currentTime;
    if (diff <= 0) return "";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (num: number) => String(num).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Determine the display status and color badges
  const renderStatusBadge = () => {
    if (isExpired) {
      return (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 border border-slate-200">
          ENDED
        </span>
      );
    }

    if (isJoinable) {
      return (
        <span className="relative inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          LIVE NOW
        </span>
      );
    }

    const timeDiff = startTime - currentTime;
    const isWithin24Hours = timeDiff < 24 * 60 * 60 * 1000;

    if (isWithin24Hours) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
          <Timer className="h-3 w-3 animate-spin [animation-duration:10s]" />
          Starts in {getCountdownString()}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
        SCHEDULED
      </span>
    );
  };

  return (
    <div
      className={`group relative rounded-xl border p-5 shadow-sm transition-all ${
        isExpired
          ? "bg-slate-50/70 border-slate-200 opacity-75"
          : isJoinable
            ? "bg-white border-blue-200 shadow-blue-50/50"
            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          {/* Badge */}
          <div>{renderStatusBadge()}</div>

          <h3
            className={`text-base font-semibold transition-colors ${
              isExpired
                ? "text-slate-500 line-through"
                : "text-slate-900 group-hover:text-blue-600"
            }`}
          >
            {meeting.title}
          </h3>

          {meeting.description && (
            <p className="text-sm text-slate-500 line-clamp-2 max-w-xl">
              {meeting.description}
            </p>
          )}
        </div>

        {/* Join CTA Handler */}
        {isJoinable ? (
          <a
            href={meeting.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all border border-transparent"
          >
            <span>Join Meeting</span>
            <Video className="ml-1.5 h-4 w-4" />
          </a>
        ) : (
          <button
            disabled
            className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-400 border border-slate-200 cursor-not-allowed"
            title={
              isExpired
                ? "This meeting has ended."
                : "Join button activates 10 minutes prior to session start."
            }
          >
            <span>Locked</span>
            <Video className="ml-1.5 h-4 w-4 opacity-50" />
          </button>
        )}
      </div>

      {/* Meta Details Footbar */}
      <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div className="flex items-center">
          <Calendar className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
          <span>
            {formattedTime} ({meeting.duration} mins)
          </span>
        </div>
        <div className="flex items-center">
          <User className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
          <span>
            {isStudent ? "Supervisor: " : "Student: "}
            <strong
              className={`font-medium ${isExpired ? "text-slate-500" : "text-slate-700"}`}
            >
              {peer?.fullName || "Unassigned"}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
