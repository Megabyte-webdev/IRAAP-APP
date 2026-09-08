"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../_context/AuthContext";
import Loading from "../(dashboard)/loading";
import { getDashboardRole } from "../_utils/roleRouting";

export const RouteProtector = ({ children }: { children: React.ReactNode }) => {
  const { authDetails, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const user = authDetails?.user;
    const effectiveRole = getDashboardRole(user);

    const isPublicPath = [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/verify-otp",
    ].includes(pathname);

    const isChangePasswordPath =
      pathname === "/change-password";

    const mustChangePassword = Boolean(
      user?.mustChangePassword,
    );

    if (!authDetails && !isPublicPath && !isChangePasswordPath) {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    if (
      authDetails &&
      mustChangePassword &&
      !isChangePasswordPath &&
      !isPublicPath
    ) {
      router.replace("/change-password?required=1");
      return;
    }

    if (
      authDetails &&
      (
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/forgot-password" ||
        pathname === "/verify-otp"
      )
    ) {
      router.replace(`/${effectiveRole || "dashboard"}`);
    }
  }, [authDetails, isLoading, router, pathname]);

  if (isLoading) {
    return <Loading />;
  }

  if (!authDetails && [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
  ].includes(pathname)) {
    return <>{children}</>;
  }

  if (authDetails) {
    return <>{children}</>;
  }

  return null;
};
