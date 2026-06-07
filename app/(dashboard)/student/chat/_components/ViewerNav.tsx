import { FiZoomIn, FiDownload, FiX } from "react-icons/fi";
import { formatMessageDate, formatTime } from "@/app/_utils/formatters";
import UserImage from "@/app/(dashboard)/_components/UserImage";
const ViewerNav = ({ user, message, handleClose, onZoom }: any) => {
  const senderName = message?.sender?.full_name || user?.full_name;
  const handleDownload = async () => {
    try {
      const response = await fetch(message.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Generate filename: bouwnce_timestamp_id
      const timestamp = new Date(message.created_at).getTime();
      a.download = `bouwnce_${timestamp}_${message.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };
  return (
    <div className="h-16 w-full flex items-center justify-between px-6 border-b border-[#0000001a]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <UserImage user={user} size={37} />
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-sm text-black leading-tight line-clamp-1">
            {senderName}
          </span>

          <span className="text-[13px] text-black line-clamp-1">
            {message?.created_at
              ? `${formatMessageDate(message.created_at)} at ${formatTime(message.created_at)}`
              : ""}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-5 text-black">
        <button onClick={onZoom} className="cursor-pointer">
          <FiZoomIn size={14} />
        </button>

        <button onClick={handleDownload} className="cursor-pointer">
          <FiDownload size={14} />
        </button>

        <button onClick={handleClose} className="cursor-pointer">
          <FiX size={14} />
        </button>
      </div>
    </div>
  );
};

export default ViewerNav;
