"use client";

import { Loader2, LogOut, ShieldAlert, X } from "lucide-react";
import Portal from "./Portal";

interface LogoutConfirmModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({
  open,
  loading = false,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) {
  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !loading) onCancel();
        }}
      >
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300">
                <LogOut size={19} />
              </div>
              <div className="min-w-0">
                <h2
                  id="logout-title"
                  className="text-base font-bold text-slate-900 dark:text-white"
                >
                  Log out of IRAAP?
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  You will be signed out of this device and its push
                  notification subscription will be disabled.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              aria-label="Close logout confirmation"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
              <Loader2 size={15} className="animate-spin text-primary" />
              <span>Signing you out securely…</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 p-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Stay signed in
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShieldAlert size={16} />
              )}
              {loading ? "Signing out…" : "Yes, log out"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
