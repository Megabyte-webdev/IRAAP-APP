"use client";

import { useParams } from "next/navigation";
import { useAuth } from "./AuthContext";
import { ConnectionStatusToast } from "../_utils/ConnectionStatusToast";
import { useSocketConnection } from "../_hooks/use-socket";

export default function SocketConnect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authDetails } = useAuth();
  const params = useParams<{ userId: string }>();

  useSocketConnection({
    authUserId: authDetails?.user?.id,
    activeUserId: params?.userId ? parseInt(params.userId) : undefined,
  });

  return (
    <>
      {children}
      <ConnectionStatusToast />
    </>
  );
}
