"use client";

import { useMemo, useRef, useCallback, useState } from "react";
import { X, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";
import { useChatUtils } from "@/app/_context/ChatContext";
import useChat from "@/app/_hooks/use-chat";
import UserImage from "@/app/(dashboard)/_components/UserImage";
import Portal from "@/app/_components/Portal";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewChatModal({ isOpen, onClose }: NewChatModalProps) {
  const { authDetails } = useAuth();
  const router = useRouter();
  const { getChatableUsers } = useChat();
  const { onlineUsers } = useChatUtils();

  const [search, setSearch] = useState("");

  const observer = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    getChatableUsers();

  const users = data?.pages.flatMap((page) => page.data) ?? [];

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    return users.filter((user: any) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const lastUserRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (!node) return;

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold: 0.5,
        },
      );

      observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
        <div className="bg-white h-full w-full md:min-h-40 md:max-h-120 md:max-w-112.5 md:rounded-xl shadow-xl flex flex-col">
          {/* HEADER */}
          <div className="p-5 flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-black">Start New Chat</h2>

              <p className="text-[13px] text-[#00000080]">
                {authDetails?.user?.role === "STUDENT"
                  ? "Search for your supervisor or fellow students to start a conversation"
                  : "Search for students or supervisors to start a conversation"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="hover:bg-gray-200 rounded-full p-2 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* SEARCH */}
          <div className="px-5 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9C9C] size-4" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full border rounded-[10px] text-gray-600 outline-0 focus:outline-1 py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          {/* USERS LIST */}
          <div className="mt-4 overflow-y-auto px-5 ">
            {isLoading ? (
              <div className="text-center text-sm text-gray-400">
                Loading users...
              </div>
            ) : users.length > 0 ? (
              <>
                {filteredUsers.map((user: any, index: number) => {
                  const isLast = index === filteredUsers.length - 1;

                  const roleLabel =
                    user.role === "SUPERVISOR" ? "Supervisor" : "Student";

                  return (
                    <div
                      key={user.id}
                      ref={isLast ? lastUserRef : null}
                      onClick={() =>
                        router.push(
                          `/${authDetails?.user?.role?.toLowerCase()}/chat/${user.id}`,
                        )
                      }
                      className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
                    >
                      <UserImage
                        user={user}
                        size={37}
                        rounded="rounded-[10px] shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-black truncate">
                            {user.fullName}
                          </span>

                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              user.role === "SUPERVISOR"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {roleLabel}
                          </span>
                        </div>

                        {user.username && (
                          <span className="text-xs text-gray-400">
                            @{user.username}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isFetchingNextPage && (
                  <div className="py-4 text-center text-sm text-gray-400">
                    Loading more users...
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-sm text-gray-400">
                No users found
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-5 grid grid-cols-2 gap-2.25 mt-auto">
            <button
              onClick={onClose}
              className="cursor-pointer py-2 border rounded-[10px] text-black"
            >
              Cancel
            </button>

            <button className="cursor-pointer py-2 bg-primary hover:bg-[#5ab9ec] text-white rounded-[10px]">
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
