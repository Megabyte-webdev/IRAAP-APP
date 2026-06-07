"use client";
import { LuImage, LuVideo, LuFile, LuMic } from "react-icons/lu";
import { formatTime } from "@/app/_utils/formatters";
import { useParams, useRouter } from "next/navigation";
import { ChatUser } from "@/app/_utils/types";
import { useAuth } from "@/app/_context/AuthContext";
import { useChatUtils } from "@/app/_context/ChatContext";
import UserImage from "@/app/(dashboard)/_components/UserImage";

const ChatCard = ({ chat }: { chat: ChatUser }) => {
  const { userId } = useParams();
  const router = useRouter();
  const { authDetails } = useAuth();
  const { typingUsers } = useChatUtils();
  const chatUser = chat?.participant;
  const currentUserId = authDetails?.user?.id;

  const isTyping = chatUser?.id ? !!typingUsers?.[chatUser.id] : false;
  const lastMessageTime = chat?.lastMessage?.created_at;
  const lastMessage = chat?.lastMessage;
  const isMine = lastMessage?.senderId === currentUserId;

  const renderLastMessage = () => {
    if (!lastMessage) {
      return `Start a conversation`;
    }

    const caption = lastMessage.caption?.trim();
    const body = lastMessage.content?.trim();
    const mediaType = lastMessage.media_type;

    const mediaClass = "inline-flex items-center gap-1 ";

    switch (mediaType) {
      case "image":
        return (
          <span className={mediaClass}>
            <LuImage className="text-[13px]" />
            <span className="truncate">{caption || "Photo"}</span>
          </span>
        );

      case "video":
        return (
          <span className={mediaClass}>
            <LuVideo className="text-[13px]" />
            <span className="truncate">{caption || "Video"}</span>
          </span>
        );

      case "file":
        return (
          <span className={mediaClass}>
            <LuFile className="text-[13px]" />
            <span className="truncate">{caption || body || "Document"}</span>
          </span>
        );

      case "audio":
        return (
          <span className={mediaClass}>
            <LuMic className="text-[13px]" />
            <span className="truncate">{caption || "Voice message"}</span>
          </span>
        );

      default:
        return <span className="truncate">{body || caption || "Message"}</span>;
    }
  };

  const goToChat = async () => {
    //resetUnread(chatUser.id);
    //await prewarmMessages(chatUser.id);

    router.push(
      `/${authDetails?.user?.role.toLowerCase()}/chat/${chatUser.id}`,
    );
  };

  return (
    <div
      onClick={() => goToChat()}
      key={chatUser?.id}
      className={`relative flex items-center gap-3 pt-3.25 pb-4.75 px-1 cursor-pointer hover:bg-gray-50 border-b-[0.53px] border-[#00000033] h-15.75 ${Number(userId) === Number(chatUser.id) ? "bg-gray-100" : ""}`}
    >
      <UserImage user={chatUser} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h4 className="font-medium text-sm truncate pr-10 ">
            {chatUser.fullName}
          </h4>
          <span className="text-[10px] text-gray-400">
            {formatTime(lastMessageTime)}
          </span>
          {chat?.unreadCount && chat?.unreadCount > 0 ? (
            <span className="absolute right-0 bottom-5 bg-red-500 text-white text-[10px] px-1 min-w-4 h-4 rounded-full flex items-center justify-center">
              {chat.unreadCount}
            </span>
          ) : null}
        </div>
        <p
          className={`text-[13px] truncate mt-0.5 pr-10 ${
            isTyping ? "text-orange animate-pulse" : "text-[#A1A1A1]"
          }`}
        >
          {isTyping ? (
            "typing..."
          ) : lastMessage ? (
            <span className="flex items-center gap-1">
              {isMine && <span className="text-gray-600">You: </span>}
              {renderLastMessage()}
            </span>
          ) : (
            `Start a conversation`
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatCard;
