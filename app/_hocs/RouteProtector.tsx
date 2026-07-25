"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../_context/AuthContext";
import Loading from "../(dashboard)/loading";

export const RouteProtector = ({ children }: { children: React.ReactNode }) => {
  const { authDetails, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const userRole = authDetails?.user?.role?.toLowerCase();

    if (!authDetails && pathname !== "/login") {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    } else if (authDetails && pathname === "/login") {
      router.replace(`/${userRole || "dashboard"}`);
    }
  }, [authDetails, isLoading, router, pathname]);

  if (isLoading) {
    return <Loading />;
  }

  if (!authDetails && pathname === "/login") {
    return <>{children}</>;
  }

  if (authDetails) {
    return <>{children}</>;
  }

  return null;
};
