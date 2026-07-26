import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface MeetingDetailsProps {
  meetingName: string;
  hostName: string;
}

export default function MeetingDetails({
  meetingName,
  hostName,
}: MeetingDetailsProps) {
  const router = useRouter();
  return (
    <div className="mb-6 text-left">
      <button
        onClick={() => router.back()}
        className="group mb-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 border border-gray-200 transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 text-gray-500 group-hover:text-gray-900" />
        <span>Back</span>
      </button>

      <span className="text-[#3DA9EC] text-xs font-semibold uppercase tracking-wider">
        UPCOMING CONSULTATION
      </span>

      <h1 className="text-2xl font-bold text-gray-900 mt-1 line-clamp-2">
        {meetingName || "Chapter 3 Architecture Review"}
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Supervisor:{" "}
        <span className="font-medium text-gray-700">{hostName || ""}</span> •
        Duration: 30 mins
      </p>
    </div>
  );
}
