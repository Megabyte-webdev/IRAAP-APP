"use client";

import {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";

import { formatMessageDate } from "@/app/_utils/formatters";
import ChatMessage from "./ChatMessage";
import ChatMediaMessage from "./ChatMediaMessage";
import ImageViewer from "./ImageViewer";
import TypingDots from "./TypingDots";
import { useAuth } from "@/app/_context/AuthContext";
import { useChatUtils } from "@/app/_context/ChatContext";
import useChat from "@/app/_hooks/use-chat";
import { useMessageReadObserver } from "@/app/_hooks/useMessageReadObserver";
import { User } from "@/app/_utils/types";
import { clearUnreadInCache } from "@/app/helpers/chat-cache";
import { queryClient } from "@/app/_services/query-client";

interface Props {
  selectedUser?: User;
  onScrollNearBottomChange?: (isNearBottom: boolean) => void;
  onUnreadChange?: (count: number) => void;
}

export type MessageListRef = {
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  markVisibleUnreadAsRead: () => void;
};

interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  status: "SENT" | "DELIVERED" | "READ";
  readAt: string | null;
  createdAt: string;
  sender: { id: number; fullName: string; role: string };
  mediaType?: string;
  mediaUrls?: string[];
}

const LOAD_MORE_THRESHOLD = 60;

const isMediaMessage = (msg: Message) =>
  !!msg.mediaType &&
  ["image", "video", "file"].includes(msg.mediaType) &&
  !!msg.mediaUrls?.length;

const MessageList = forwardRef<MessageListRef, Props>(
  ({ onScrollNearBottomChange, onUnreadChange, selectedUser }, ref) => {
    const { authDetails } = useAuth();
    const { setReplyTo, typingUsers } = useChatUtils();
    const { userId } = useParams<{ userId: string }>();
    const { getMessages } = useChat();

    const {
      data: messagesData,
      isLoading,
      isFetching,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = getMessages(Number(userId));

    // ── Refs─
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hasScrolledInitiallyRef = useRef(false);
    const prevScrollHeightRef = useRef(0);
    const prevScrollTopRef = useRef(0);
    const loadingOlderRef = useRef(false);
    const lastMessageIdRef = useRef<number | null>(null);
    const markedReadRef = useRef<Set<number>>(new Set());

    // ── State
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    // ── Derived data
    const flatMessages: Message[] =
      messagesData?.pages?.flatMap((page: any) => page?.data ?? []) ?? [];

    const deduped = useMemo(() => {
      const seen = new Set<number>();
      return flatMessages.filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
    }, [flatMessages]);

    const sortedMessages = useMemo(
      () =>
        [...deduped].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      [deduped],
    );

    const groupedMessages = useMemo(() => {
      const map: Record<
        string,
        { label: string; timestamp: number; messages: Message[] }
      > = {};
      for (const msg of sortedMessages) {
        const label = formatMessageDate(msg.createdAt);
        if (!map[label])
          map[label] = {
            label,
            timestamp: new Date(msg.createdAt).getTime(),
            messages: [],
          };
        map[label].messages.push(msg);
      }
      return Object.values(map).sort((a, b) => a.timestamp - b.timestamp);
    }, [sortedMessages]);

    const mediaMessages = useMemo(() => {
      const out: any[] = [];
      for (const m of sortedMessages) {
        if (m.mediaType === "image" && Array.isArray(m.mediaUrls)) {
          m.mediaUrls.forEach((url, i) =>
            out.push({
              src: url,
              id: `${m.id}-${i}`,
              parent_id: m.id,
              createdAt: m.createdAt,
              sender: m.sender,
              senderId: m.senderId,
            }),
          );
        }
      }
      return out;
    }, [sortedMessages]);

    const mediaIndexMap = useMemo(() => {
      const map = new Map<string, number>();
      mediaMessages.forEach((m, i) => map.set(m.src, i));
      return map;
    }, [mediaMessages]);

    const isTyping = typingUsers[Number(userId)];
    const conversationId = messagesData?.pages?.[0]?.conversationId;

    // ── Intersection-observer based read receipts (WhatsApp style)
    useMessageReadObserver({
      containerRef,
      messages: sortedMessages,
      authUserId: Number(authDetails?.user?.id),
      conversationId,
      recipientId: Number(userId),
      // Only observe when tab is mounted and has a conversation loaded
      enabled: !!userId && !!conversationId,
    });

    // ── Helpers─
    const isNearBottom = () => {
      const el = containerRef.current;
      if (!el) return true;
      return el.scrollHeight - el.scrollTop - el.clientHeight < 180;
    };

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      });
    };

    // Exposed via ref — ChatWindow calls this when scroll-to-bottom is tapped
    // The observer handles the actual reading; this is a no-op kept for API compat
    const markVisibleUnreadAsRead = () => {};

    useImperativeHandle(ref, () => ({
      scrollToBottom,
      markVisibleUnreadAsRead,
    }));

    const scrollToMessage = (messageId: number) => {
      const target = document.querySelector(
        `[data-message-id="${messageId}"]`,
      ) as HTMLElement | null;
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("bg-yellow-100");
      setTimeout(() => target.classList.remove("bg-yellow-100"), 800);
    };

    // ── Reset on chat switch
    useEffect(() => {
      hasScrolledInitiallyRef.current = false;
      markedReadRef.current = new Set();
      lastMessageIdRef.current = null;
      loadingOlderRef.current = false;
      clearUnreadInCache(queryClient, Number(userId));
    }, [userId]);

    // ── Initial scroll to bottom
    useLayoutEffect(() => {
      const el = containerRef.current;
      if (!el || !sortedMessages.length || hasScrolledInitiallyRef.current)
        return;

      let f1: number, f2: number;
      const scrollNow = () => {
        el.scrollTop = el.scrollHeight;
      };

      f1 = requestAnimationFrame(() => {
        scrollNow();
        f2 = requestAnimationFrame(() => {
          scrollNow();
          hasScrolledInitiallyRef.current = true;
        });
      });

      const ro = new ResizeObserver(() => {
        if (!hasScrolledInitiallyRef.current) scrollNow();
      });
      ro.observe(el);

      const t = setTimeout(() => {
        ro.disconnect();
        hasScrolledInitiallyRef.current = true;
        scrollNow();
      }, 3000);

      return () => {
        cancelAnimationFrame(f1);
        cancelAnimationFrame(f2);
        ro.disconnect();
        clearTimeout(t);
      };
    }, [userId, sortedMessages.length]);

    // Restore scroll after pagination
    useLayoutEffect(() => {
      const el = containerRef.current;
      if (!el || !loadingOlderRef.current) return;
      el.scrollTop =
        prevScrollTopRef.current +
        (el.scrollHeight - prevScrollHeightRef.current);
      loadingOlderRef.current = false;
    }, [messagesData?.pages]);

    // ── Auto scroll on new message
    useLayoutEffect(() => {
      if (!hasScrolledInitiallyRef.current || loadingOlderRef.current) return;
      const last = sortedMessages.at(-1);
      if (!last || last.id === lastMessageIdRef.current) return;

      const prev = lastMessageIdRef.current;
      lastMessageIdRef.current = last.id;
      if (!prev) return;

      const isMine = last.senderId === Number(authDetails?.user?.id);
      if (isMine || isNearBottom())
        requestAnimationFrame(() => scrollToBottom("smooth"));
    }, [sortedMessages]);

    // ── Unread count
    const unreadCount = useMemo(() => {
      const myId = Number(authDetails.user.id);

      return sortedMessages.filter(
        (m) => m.senderId !== myId && m.status !== "READ",
      ).length;
    }, [sortedMessages]);

    useEffect(() => {
      onUnreadChange?.(unreadCount);
    }, [unreadCount]);

    // ── Scroll handler ─
    const handleScroll = async () => {
      const el = containerRef.current;
      if (!el) return;

      onScrollNearBottomChange?.(!isNearBottom());

      if (!hasNextPage || isFetchingNextPage || loadingOlderRef.current) return;

      if (el.scrollTop <= LOAD_MORE_THRESHOLD) {
        loadingOlderRef.current = true;
        prevScrollHeightRef.current = el.scrollHeight;
        prevScrollTopRef.current = el.scrollTop;
        await fetchNextPage();
      }
    };

    // ── Loading / empty
    const totalMessages =
      messagesData?.pages?.flatMap((p: any) => p?.data ?? []).length ?? 0;

    if (isLoading && totalMessages === 0) {
      return (
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 ? "justify-start" : "justify-end"}`}
            >
              <div className="animate-pulse bg-gray-200 rounded-xl w-1/2 h-10" />
            </div>
          ))}
        </div>
      );
    }

    if (!sortedMessages.length && !isFetching) {
      return (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          No messages yet. Say hello!
        </div>
      );
    }

    // ── Render──
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 pt-2 space-y-6 pb-14 md:pb-6 bg-white overscroll-y-none"
        >
          <div className="sticky top-2 z-30 flex justify-center pointer-events-none">
            {isFetchingNextPage && (
              <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-full px-3 py-1 text-[11px] text-gray-500 animate-in fade-in duration-200">
                Loading messages...
              </div>
            )}
          </div>

          {groupedMessages.map((group) => (
            <div key={group.label}>
              <div className="sticky top-0 z-10 flex justify-center my-4">
                <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full">
                  {group.label}
                </span>
              </div>

              <div className="space-y-2">
                {group.messages.map((msg) =>
                  isMediaMessage(msg) ? (
                    <ChatMediaMessage
                      key={msg.id}
                      msg={msg}
                      onReply={() =>
                        setReplyTo({
                          id: String(msg.id),
                          content: msg.content,
                          senderId: msg.senderId,
                          sender: msg.sender,
                        })
                      }
                      onOpen={handleOpenImage}
                      onRetry={() => {}}
                      onScrollToMessage={scrollToMessage}
                    />
                  ) : (
                    <ChatMessage
                      selectedUser={selectedUser}
                      key={msg.id}
                      msg={msg}
                      onReply={() =>
                        setReplyTo({
                          id: String(msg.id),
                          content: msg.content,
                          senderId: msg.senderId,
                          sender: msg.sender,
                        })
                      }
                      onScrollToMessage={scrollToMessage}
                    />
                  ),
                )}
              </div>
            </div>
          ))}

          {isTyping && <TypingDots />}
          <div className="h-2" />
        </div>

        <ImageViewer
          media={mediaMessages}
          startIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
          viewerOpen={viewerOpen}
        />
      </div>
    );

    function handleOpenImage(url: string) {
      const index = mediaIndexMap.get(url);
      if (index === undefined) return;
      setViewerIndex(index);
      setViewerOpen(true);
    }
  },
);

MessageList.displayName = "MessageList";
export default MessageList;
