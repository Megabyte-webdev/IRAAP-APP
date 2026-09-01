"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { driver, type DriveStep, type Driver } from "driver.js";

interface AppTourProps {
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
}

const TOUR_KEY = "iraap_tour_completed";
const MOBILE_QUERY = "(max-width: 1023px)";

const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;

const findVisibleTourElement = (name: string): Element | undefined => {
  if (typeof document === "undefined") return undefined;

  const elements = Array.from(
    document.querySelectorAll(`[data-tour="${name}"]`),
  );

  return elements.find((element) => {
    const node = element as HTMLElement;
    const rect = node.getBoundingClientRect();
    const style = window.getComputedStyle(node);

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      rect.width > 0 &&
      rect.height > 0
    );
  });
};

const waitForVisibleTourElement = (name: string, timeout = 2500) =>
  new Promise<Element | undefined>((resolve) => {
    const started = performance.now();

    const check = () => {
      const element = findVisibleTourElement(name);

      if (element) {
        resolve(element);
        return;
      }

      if (performance.now() - started >= timeout) {
        resolve(undefined);
        return;
      }

      window.requestAnimationFrame(check);
    };

    check();
  });

const getStep = (name: string, title: string, description: string, mobileSidebar = true): DriveStep => ({
  element: () => findVisibleTourElement(name) as Element,
  popover: {
    title,
    description,
    side: mobileSidebar ? "right" : "bottom",
    align: mobileSidebar ? "start" : "end",
  },
  data: { mobileSidebar },
});

const baseSteps: DriveStep[] = [
  getStep(
    "sidebar",
    "Your workspace",
    "Use the main navigation to move between your dashboard, research work, conversations, meetings and the academic archive.",
  ),
  getStep(
    "archive",
    "Explore the archive",
    "Search and browse approved academic projects across the repository using filters and keywords.",
  ),
  getStep(
    "chat",
    "Stay connected",
    "Message supervisors and collaborators directly from your workspace.",
  ),
  getStep(
    "meetings",
    "Meet online",
    "Start or join scheduled academic meetings without leaving IRAAP.",
  ),
  getStep(
    "profile",
    "Manage your profile",
    "Keep your photo and academic information up to date from your profile menu.",
    false,
  ),
];

export default function AppTour({
  onOpenSidebar,
  onCloseSidebar,
}: AppTourProps) {
  const pathname = usePathname();
  const driverRef = useRef<Driver | null>(null);
  const shouldStartRef = useRef(false);

  const isDisabledRoute = useCallback(() => {
    const currentPath = pathname ?? "";
    return (
      currentPath.includes("/profile") ||
      currentPath.includes("/room") ||
      currentPath.includes("/waiting")
    );
  }, [pathname]);

  const closeSidebarIfMobile = useCallback(() => {
    if (isMobile()) onCloseSidebar?.();
  }, [onCloseSidebar]);

  const finishTour = useCallback(
    (markCompleted = true) => {
      if (markCompleted) {
        localStorage.setItem(TOUR_KEY, "1");
      }

      closeSidebarIfMobile();
      driverRef.current?.destroy();
      driverRef.current = null;
    },
    [closeSidebarIfMobile],
  );

  const createTour = useCallback(() => {
    if (isDisabledRoute() || typeof window === "undefined") return null;

    const tour = driver({
      showProgress: true,
      progressText: "{{current}} of {{total}}",
      animate: true,
      duration: 300,
      smoothScroll: true,
      allowClose: true,
      overlayColor: "rgba(15, 23, 42, 0.56)",
      popoverClass: "iraap-driver-popover",
      stagePadding: 6,
      stageRadius: 12,
      popoverOffset: 12,
      showButtons: ["previous", "next", "close"],
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      steps: baseSteps,

      onHighlightStarted: (_element, step) => {
        const mobileSidebarStep = Boolean(step.data?.mobileSidebar);

        if (!isMobile()) return;

        if (mobileSidebarStep) {
          onOpenSidebar?.();
        } else {
          onCloseSidebar?.();
        }

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            tour.refresh();
          });
        });
      },

      onDoneClick: () => {
        localStorage.setItem(TOUR_KEY, "1");
        closeSidebarIfMobile();
        tour.destroy();
      },

      onCloseClick: () => {
        // Dismissal should not trap the user in a permanently incomplete state.
        localStorage.setItem(TOUR_KEY, "1");
        closeSidebarIfMobile();
        tour.destroy();
      },

      onDestroyed: () => {
        closeSidebarIfMobile();
        driverRef.current = null;
      },
    });

    driverRef.current = tour;
    return tour;
  }, [closeSidebarIfMobile, isDisabledRoute, onCloseSidebar, onOpenSidebar]);

  const startTour = useCallback(() => {
    if (isDisabledRoute()) return;

    driverRef.current?.destroy();
    const tour = createTour();
    if (!tour) return;

    shouldStartRef.current = true;

    const start = async () => {
      if (isMobile()) {
        onOpenSidebar?.();
        await waitForVisibleTourElement("sidebar");
      }

      if (!shouldStartRef.current) return;
      tour.drive();
    };

    void start();
  }, [createTour, isDisabledRoute, onOpenSidebar]);

  useEffect(() => {
    if (isDisabledRoute()) return;

    const handleRestart = () => {
      localStorage.removeItem(TOUR_KEY);
      startTour();
    };

    window.addEventListener("iraap:restart-tour", handleRestart);

    return () => {
      window.removeEventListener("iraap:restart-tour", handleRestart);
      shouldStartRef.current = false;
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, [isDisabledRoute, startTour]);

  useEffect(() => {
    if (isDisabledRoute()) return;

    const completed = localStorage.getItem(TOUR_KEY);
    if (completed === "1") return;

    const timer = window.setTimeout(() => {
      startTour();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [isDisabledRoute, pathname, startTour]);

  return null;
}
