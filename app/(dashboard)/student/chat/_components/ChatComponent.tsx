"use client";
import ChatWindow from "./ChatWindow";
import ChatSidebar from "./SideBar";
import { useParams } from "next/navigation";
import useChat from "@/app/_hooks/use-chat";

interface ChatComponentProps {
  role?: "buyer" | "vendor";
}

const ChatComponent = ({ role = "buyer" }: ChatComponentProps) => {
  const { userId } = useParams<any>();
  const { getChatUserById } = useChat();
  const { data: selectedUser, isLoading, isFetching } = getChatUserById(userId);

  return (
    <div className="flex h-[calc(100dvh-80px)] bg-white min-h-0 overflow-hidden  border-[0.56px] border-t-0 border-l-0 border-[#00000033]">
      <ChatSidebar role={role} selectedUser={selectedUser} />
      <ChatWindow
        selectedUser={selectedUser}
        isConversationLoading={isLoading || isFetching}
        role={role}
      />
    </div>
  );
};

export default ChatComponent;
