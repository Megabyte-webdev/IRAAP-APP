"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export const ChatContext = createContext<any>({});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { authDetails } = useAuth();
  const authUserId = authDetails?.user?.id;

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [replyTo, setReplyTo] = useState<any>(null);

  const activeUploadsRef = useRef(new Map<string, File[]>());
  const prewarmedCacheRef = useRef<Record<string, any>>({});

  const resetChatState = useCallback(() => {
    prewarmedCacheRef.current = {};
    setSelectedChat(null);
    setReplyTo(null);
    setTypingUsers({});
    setOnlineUsers(new Set());
    activeUploadsRef.current = new Map();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        typingUsers,
        setTypingUsers,
        onlineUsers,
        setOnlineUsers,
        replyTo,
        setReplyTo,
        prewarmedCacheRef,
        resetChatState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatUtils = () => useContext(ChatContext);
