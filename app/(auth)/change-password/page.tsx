"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuthShell from "../_components/AuthShell";

import { authService } from "@/app/_services/auth.service";
import { useAuth } from "@/app/_context/AuthContext";
import { onFailure, onSuccess } from "@/app/_utils/Notification";
import { extractErrorMessage } from "@/app/_lib/utils";

function ChangePasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  const { authDetails, setAuthDetails } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");

  const [password, setPassword] = useState("");

  const [confirm, setConfirm] = useState("");

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const required =
    params.get("required") === "1" ||
    Boolean(authDetails?.user?.mustChangePassword);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);

    if (!currentPassword.trim()) {
      setError(
        required
          ? "Please enter your temporary password."
          : "Please enter your current password.",
      );
      return;
    }

    if (password.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Your passwords do not match.");
      return;
    }

    if (password === currentPassword) {
      setError(
        "Your new password must be different from your current password.",
      );
      return;
    }

    setBusy(true);

    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword: password,
      });

      /**
       * Prefer the user returned by the backend.
       * This keeps the frontend state aligned with
       * the actual server-side account state.
       */
      const updatedUser =
        response?.user || authDetails?.user
          ? {
              ...authDetails?.user,
              ...response?.user,
              mustChangePassword: false,
            }
          : undefined;

      const updatedAuthDetails = authDetails
        ? {
            ...authDetails,
            user: updatedUser,
          }
        : null;

      if (updatedAuthDetails) {
        setAuthDetails(updatedAuthDetails);
      }

      if (updatedUser) {
        localStorage.setItem("iraapUser", JSON.stringify(updatedUser));
      }

      onSuccess({
        title: "Password changed",
        message: "Your password has been updated successfully.",
      });

      /**
       * Never leave a newly created user
       * stuck on the forced-password page.
       */
      const organizationRole = updatedUser?.organizationRole;

      const role =
        organizationRole === "MANAGER"
          ? "manager"
          : updatedUser?.role?.toLowerCase() || "dashboard";

      router.replace(`/${role}`);
    } catch (err) {
      const message =
        extractErrorMessage(err) || "Unable to change your password.";

      setError(message);

      onFailure({
        title: "Password change failed",
        message,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Change your password"
      description={
        required
          ? "For security, you must choose a new password before continuing."
          : "Update your IRAAP password."
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="current-password" className="text-sm font-medium">
            {required ? "Temporary password" : "Current password"}
          </label>

          <input
            id="current-password"
            required
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={
              required
                ? "Enter your temporary password"
                : "Enter your current password"
            }
            className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm font-medium">
            New password
          </label>

          <input
            id="new-password"
            required
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (8+ characters)"
            className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm new password
          </label>

          <input
            id="confirm-password"
            required
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm your new password"
            className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Change password"}
        </button>
      </form>
    </AuthShell>
  );
}

/**
 * Next.js App Router requires a Suspense boundary
 * around components that use useSearchParams().
 */
export default function ChangePasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell
          title="Change your password"
          description="Loading password settings..."
        >
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        </AuthShell>
      }
    >
      <ChangePasswordForm />
    </Suspense>
  );
}
