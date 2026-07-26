interface MeetingDetailsProps {
  meetingName: string;
  hostName: string;
}

export default function MeetingDetails({
  meetingName,
  hostName,
}: MeetingDetailsProps) {
  return (
    <div className="mb-6 text-left">
      <span className="text-[#3DA9EC] text-xs font-semibold uppercase tracking-wider">
        UPCOMING CONSULTATION
      </span>
      <h1 className="text-2xl font-bold text-gray-900 mt-1">
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
