"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface Step {
  target: string;
  title: string;
  description: string;
}

const baseSteps: Step[] = [
  { target: "workspace", title: "Your workspace", description: "Use the main navigation to move between your dashboard, research work, conversations, meetings and the academic archive." },
  { target: "archive", title: "Explore the archive", description: "Search and browse approved academic projects across the repository using filters and keywords." },
  { target: "chat", title: "Stay connected", description: "Message supervisors and collaborators directly from your workspace." },
  { target: "meetings", title: "Meet online", description: "Start or join scheduled academic meetings without leaving IRAAP." },
  { target: "profile", title: "Manage your profile", description: "Keep your photo and academic information up to date from your profile menu." },
];

function resolveTarget(target: string) {
  if (target === "workspace") {
    const desktop = document.querySelector('[data-tour="sidebar"]');
    const mobile = document.querySelector('[data-tour="menu"]');
    return window.innerWidth < 1024 ? (mobile || desktop) : (desktop || mobile);
  }
  return document.querySelector(`[data-tour="${target}"]`);
}

export default function AppTour() {
  const pathname = usePathname();
  const [stepIndex, setStepIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [steps, setSteps] = useState<Step[]>(baseSteps);

  useEffect(() => {
    const restart = () => {
      if (pathname?.includes("/profile") || pathname?.includes("/room") || pathname?.includes("/waiting")) return;
      setStepIndex(0);
      setOpen(true);
    };
    window.addEventListener("iraap:restart-tour", restart);
    return () => window.removeEventListener("iraap:restart-tour", restart);
  }, [pathname]);

  useEffect(() => {
    if (!pathname || pathname.includes("/profile") || pathname.includes("/room") || pathname.includes("/waiting")) return;
    const completed = localStorage.getItem("iraap_tour_completed");
    if (completed === "1") return;
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const refreshSteps = () => {
      const available = baseSteps.filter((step) => {
        const node = resolveTarget(step.target);
        if (!node) return false;
        const box = node.getBoundingClientRect();
        return box.width > 0 && box.height > 0;
      });
      setSteps(available);
      setStepIndex((index) => Math.min(index, Math.max(available.length - 1, 0)));
    };

    refreshSteps();
    window.addEventListener("resize", refreshSteps);
    window.visualViewport?.addEventListener("resize", refreshSteps);
    return () => {
      window.removeEventListener("resize", refreshSteps);
      window.visualViewport?.removeEventListener("resize", refreshSteps);
    };
  }, [open, pathname]);

  useEffect(() => {
    if (!open || !steps[stepIndex]) return;
    const node = resolveTarget(steps[stepIndex].target);
    if (!node) return;

    const update = () => {
      const element = node as HTMLElement;
      const box = element.getBoundingClientRect();
      setRect(box.width > 0 && box.height > 0 ? box : null);
    };

    update();
    node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

    const visualViewport = window.visualViewport;
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    visualViewport?.addEventListener("resize", update);
    visualViewport?.addEventListener("scroll", update);

    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      visualViewport?.removeEventListener("resize", update);
      visualViewport?.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [open, stepIndex, steps]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const tooltipStyle = useMemo(() => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 390;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 844;
    const width = Math.min(360, Math.max(280, viewportWidth - 24));

    if (!rect) {
      return {
        top: Math.max(12, (viewportHeight - 280) / 2),
        left: Math.max(12, (viewportWidth - width) / 2),
        width,
        maxHeight: Math.max(220, viewportHeight - 24),
      } as CSSProperties;
    }

    const margin = 12;
    const preferredBelow = rect.bottom + 12;
    const preferredAbove = rect.top - 12;
    const estimatedHeight = Math.min(280, viewportHeight * 0.62);

    let top = preferredBelow;
    if (preferredBelow + estimatedHeight > viewportHeight - margin) {
      top = preferredAbove - estimatedHeight;
    }

    top = Math.min(Math.max(margin, top), Math.max(margin, viewportHeight - estimatedHeight - margin));

    const centerLeft = rect.left + rect.width / 2 - width / 2;
    const left = Math.min(
      Math.max(margin, centerLeft),
      Math.max(margin, viewportWidth - width - margin),
    );

    return {
      top,
      left,
      width,
      maxHeight: Math.max(220, viewportHeight - 24),
      overflowY: "auto",
    } as CSSProperties;
  }, [rect]);

  if (!open || !steps.length) return null;
  const current = steps[stepIndex];
  const last = stepIndex === steps.length - 1;

  function finish() {
    localStorage.setItem("iraap_tour_completed", "1");
    setOpen(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-[9990] bg-slate-950/45 backdrop-blur-[1px]" onClick={finish} />
      {rect && <div className="pointer-events-none fixed z-[9991] rounded-xl ring-4 ring-white shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]" style={{ top: rect.top - 4, left: rect.left - 4, width: rect.width + 8, height: rect.height + 8 }} />}
      <section className="fixed z-[9992] rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl sm:p-5 dark:border-slate-700 dark:bg-slate-900 dark:text-white" style={tooltipStyle} role="dialog" aria-label="IRAAP guided tour">
        <button type="button" onClick={finish} aria-label="Close tour" className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"><X className="h-4 w-4" /></button>
        <div className="pr-7"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary"><HelpCircle className="h-3.5 w-3.5" /> IRAAP tour</div><h2 className="text-base font-bold">{current.title}</h2><p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{current.description}</p></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="text-[11px] font-semibold text-slate-400">{stepIndex + 1} of {steps.length}</span><div className="flex items-center gap-2"><button type="button" onClick={() => setStepIndex((v) => Math.max(0, v - 1))} disabled={stepIndex === 0} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40 dark:border-slate-700"><ChevronLeft className="h-3.5 w-3.5" /> Back</button><button type="button" onClick={() => last ? finish() : setStepIndex((v) => v + 1)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90">{last ? "Finish" : "Next"} {!last && <ChevronRight className="h-3.5 w-3.5" />}</button></div></div>
      </section>
    </>
  );
}
