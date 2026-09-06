"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "../_components/AuthShell";
import { authService } from "@/app/_services/auth.service";
import { useAuth } from "@/app/_context/AuthContext";
import { onFailure, onSuccess } from "@/app/_utils/Notification";
import { extractErrorMessage } from "@/app/_lib/utils";

export default function ChangePasswordPage() {
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8)
      return setError("Your new password must be at least 8 characters.");
    if (password !== confirm) return setError("Your passwords do not match.");
    setBusy(true);
    try {
      await authService.changePassword({
        currentPassword: currentPassword,
        newPassword: password,
      });
      const updated = {
        ...authDetails,
        user: { ...authDetails?.user, mustChangePassword: false },
      };
      setAuthDetails(updated);
      localStorage.setItem("iraapUser", JSON.stringify(updated));
      onSuccess({
        title: "Password changed",
        message: "Your password has been updated successfully.",
      });
      const role =
        updated?.user?.organizationRole === "MANAGER"
          ? "manager"
          : updated?.user?.role?.toLowerCase() || "dashboard";
      router.replace(`/${role}`);
    } catch (err) {
      const message =
        extractErrorMessage(err) || "Unable to change your password.";
      setError(message);
      onFailure({ title: "Password change failed", message });
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
        {!required && (
          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="h-10 w-full rounded-lg border px-3 text-sm"
          />
        )}
        {required && (
          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Temporary password"
            className="h-10 w-full rounded-lg border px-3 text-sm"
          />
        )}
        <input
          required
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (8+ characters)"
          className="h-10 w-full rounded-lg border px-3 text-sm"
        />
        <input
          required
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          className="h-10 w-full rounded-lg border px-3 text-sm"
        />
        <button
          disabled={busy}
          className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Change password"}
        </button>
      </form>
    </AuthShell>
  );
}
