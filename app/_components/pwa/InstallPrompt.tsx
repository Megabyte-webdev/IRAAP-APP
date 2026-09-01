"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (standalone || localStorage.getItem("iraap_pwa_dismissed") === "1")
      return;
    const isIosDevice =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
      (window.navigator as any).standalone !== true;
    if (isIosDevice) setIos(true);
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferred(event as InstallPromptEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installed = () => {
      localStorage.setItem("iraap_pwa_installed", "1");
      setOpen(false);
    };
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  if (!open || (!deferred && !ios)) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const result = await deferred!.userChoice;
    if (result.outcome === "accepted") setOpen(false);
    setDeferred(null);
  }

  function dismiss() {
    localStorage.setItem("iraap_pwa_dismissed", "1");
    setOpen(false);
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-9980 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Dismiss install prompt"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Image
            src="/irap-logo.png"
            alt="IRAAP"
            width={40}
            height={40}
            className="h-7 w-auto"
          />
        </div>
        <div>
          <p className="text-sm font-bold">Install IRAAP</p>
          {ios ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              In Safari, tap Share, then choose{" "}
              <span className="font-semibold">Add to Home Screen</span> to
              install IRAAP.
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Install the repository for faster access and an app-like
              experience.
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={dismiss}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold dark:border-slate-700"
        >
          Not now
        </button>
        {!ios && (
          <button
            type="button"
            onClick={install}
            className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white"
          >
            Install app
          </button>
        )}
      </div>
    </div>
  );
}
