"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, PlusCircle } from "lucide-react";
import ChatCard from "./ChatCard";
import { useParams } from "next/navigation";
import NewChatModal from "./NewChatModal";
import { ChatUser, User } from "@/app/_utils/types";
import useChat from "@/app/_hooks/use-chat";

interface ChatSidebarProps {
  selectedUser?: User;
  role?: "buyer" | "vendor";
}

const ChatSidebar = ({ selectedUser, role = "buyer" }: ChatSidebarProps) => {
  const { getConversations } = useChat();
  const { userId } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    getConversations();

  const conversations = data?.pages.flatMap((page) => page.data) ?? [];

  const activeConversation = useMemo(() => {
    if (!selectedUser) return null;

    const existing = conversations?.find(
      (c: any) => c.participant?.id === selectedUser.id,
    );

    if (existing) return null;

    return {
      id: `temp-${selectedUser.id}`,
      participant: {
        ...selectedUser,
      },
    };
  }, [selectedUser, conversations]);

  const filteredConversations = useMemo(() => {
    const baseList = [...conversations];

    if (activeConversation) {
      baseList.unshift(activeConversation);
    }

    if (!searchQuery) return baseList;

    return baseList.filter((conversation: any) =>
      conversation.participant?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery, activeConversation]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <div
      className={`w-80 min-w-80 h-full min-h-0 flex flex-col bg-white border-r-[0.53px] border-[#00000033] overflow-hidden
    ${userId ? "hidden md:flex" : "flex-1 md:flex md:flex-0"}`}
    >
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between h-15.5 border-b-[0.53px] border-[#00000033]">
        <h2 className="text-[16px] font-semibold">Chats</h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer max-w-17.75 h-7.5 flex-1 bg-primary outline-[0.83px] outline-primary border border-[#F4F4F4] hover:bg-[#156fee] text-white p-2 rounded-full text-xs font-medium flex items-center justify-center transition-all"
        >
          <PlusCircle fill="#022b8a" className="size-4 mr-1.75" />
          New
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative z-5 px-2 pb-[7.73px] my-2 border-b-[0.53px] border-[#00000033]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9C9C] size-4" />

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-[0.53px] border-[#0000004D] rounded-[10px] py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-b focus:pb-3 placeholder:text-[#9C9C9C]"
          />
        </div>
      </div>

      {/* LIST */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 pb-2"
      >
        {isLoading ? (
          <div className="text-center mt-10 text-gray-400 text-sm">
            Loading chats...
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((chat: ChatUser) => (
            <ChatCard key={chat?.participant?.id} chat={chat} />
          ))
        ) : (
          <div className="text-center mt-10 text-gray-400 text-sm">
            No chats found
          </div>
        )}

        {isFetchingNextPage && (
          <div className="text-center text-xs text-gray-400 py-3">
            Loading more conversations...
          </div>
        )}
      </div>

      {/* MODAL */}
      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ChatSidebar;
