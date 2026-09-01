"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { driver, type DriveStep, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../tour.css";

interface AppTourProps {
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
}

const TOUR_KEY = "iraap_tour_completed";
const BREAKPOINT = 1024;
const WAIT_TIMEOUT = 2500;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth < BREAKPOINT;

const getSelectorForViewport = (desktop: string, mobile: string) =>
  isMobileViewport() ? mobile : desktop;

const waitForVisible = async (selector: string, timeout = WAIT_TIMEOUT) => {
  const started = Date.now();

  while (Date.now() - started < timeout) {
    const matches = Array.from(document.querySelectorAll(selector));
    const visible = matches.find((element) => {
      const el = element as HTMLElement;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        rect.width > 0 &&
        rect.height > 0
      );
    });

    if (visible) return visible;
    await sleep(80);
  }

  return null;
};

const stepWithResponsiveTarget = ({
  desktop,
  mobile,
  title,
  description,
  side = "right",
  align = "start",
  onNextClick,
  onPrevClick,
}: {
  desktop: string;
  mobile: string;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  onNextClick?: (
    element: Element | undefined,
    step: DriveStep,
    options: {
      config: unknown;
      state: unknown;
      driver: Driver;
      index: number | undefined;
    },
  ) => void | Promise<void>;
  onPrevClick?: (
    element: Element | undefined,
    step: DriveStep,
    options: {
      config: unknown;
      state: unknown;
      driver: Driver;
      index: number | undefined;
    },
  ) => void | Promise<void>;
}): DriveStep => ({
  element: getSelectorForViewport(desktop, mobile),
  waitForElement: WAIT_TIMEOUT,
  popover: {
    title,
    description,
    side,
    align,
    onNextClick:
      onNextClick ?? ((_element, _step, { driver }) => driver.moveNext()),
    onPrevClick:
      onPrevClick ?? ((_element, _step, { driver }) => driver.movePrevious()),
  },
});

export default function AppTour({
  onOpenSidebar,
  onCloseSidebar,
}: AppTourProps) {
  const pathname = usePathname();
  const driverRef = useRef<Driver | null>(null);
  const completionHandledRef = useRef(false);

  const [viewportMode, setViewportMode] = useState<"mobile" | "desktop">(
    typeof window !== "undefined" && window.innerWidth < BREAKPOINT
      ? "mobile"
      : "desktop",
  );

  const isDisabledRoute = useCallback(() => {
    const currentPath = pathname ?? "";
    return (
      currentPath.includes("/profile") ||
      currentPath.includes("/room") ||
      currentPath.includes("/waiting")
    );
  }, [pathname]);

  // Track viewport changes
  useEffect(() => {
    const handleResize = () => {
      const nextMode = isMobileViewport() ? "mobile" : "desktop";
      setViewportMode(nextMode);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Main Driver Lifecycle
  useEffect(() => {
    if (isDisabledRoute()) return;

    const completed = localStorage.getItem(TOUR_KEY);
    if (completed === "1") return;

    let destroyed = false;
    completionHandledRef.current = false;
    const mobile = viewportMode === "mobile";

    const moveNextFromSidebar = async (
      driverObj: Driver,
      nextSelector: string,
    ) => {
      if (!mobile) {
        driverObj.moveNext();
        return;
      }

      onOpenSidebar?.();
      const next = await waitForVisible(nextSelector);
      if (!next || destroyed) return;

      await sleep(100);
      driverObj.moveNext();
    };

    const movePreviousFromSidebar = async (
      driverObj: Driver,
      prevSelector: string,
    ) => {
      if (!mobile) {
        driverObj.movePrevious();
        return;
      }

      onOpenSidebar?.();
      await waitForVisible(prevSelector);
      if (!destroyed) driverObj.movePrevious();
    };

    const closeDrawerAndMoveNext = async (driverObj: Driver) => {
      if (!mobile) {
        driverObj.moveNext();
        return;
      }

      onCloseSidebar?.();
      await waitForVisible('[data-tour="profile"]');
      if (!destroyed) {
        await sleep(100);
        driverObj.moveNext();
      }
    };

    const steps: DriveStep[] = [
      {
        popover: {
          title: "Welcome to IRAAP 🎓",
          description:
            "A quick tour of your workspace so you can easily navigate research, archive records, meetings, and team chat.",
          align: "center",
        },
      },
      stepWithResponsiveTarget({
        desktop: '[data-tour="sidebar"]',
        mobile: '[data-tour="mobile-sidebar"]',
        title: "Your workspace",
        description:
          "Use the main navigation to move between your dashboard, research work, conversations, meetings and the academic archive.",
        side: mobile ? "bottom" : "right",
        align: mobile ? "center" : "start",
        onNextClick: mobile
          ? (_element, _step, { driver }) =>
              moveNextFromSidebar(driver, '[data-tour="mobile-archive"]')
          : undefined,
        onPrevClick: mobile
          ? (_element, _step, { driver }) => driver.movePrevious()
          : undefined,
      }),
      stepWithResponsiveTarget({
        desktop: '[data-tour="archive"]',
        mobile: '[data-tour="mobile-archive"]',
        title: "Explore the archive",
        description:
          "Search and browse approved academic projects across the repository using filters and keywords.",
        side: mobile ? "bottom" : "right",
        align: mobile ? "center" : "start",
        onNextClick: mobile
          ? (_element, _step, { driver }) =>
              moveNextFromSidebar(driver, '[data-tour="mobile-chat"]')
          : undefined,
        onPrevClick: mobile
          ? (_element, _step, { driver }) =>
              movePreviousFromSidebar(driver, '[data-tour="mobile-sidebar"]')
          : undefined,
      }),
      stepWithResponsiveTarget({
        desktop: '[data-tour="chat"]',
        mobile: '[data-tour="mobile-chat"]',
        title: "Stay connected",
        description:
          "Message supervisors and collaborators directly from your workspace.",
        side: mobile ? "bottom" : "right",
        align: mobile ? "center" : "start",
        onNextClick: mobile
          ? (_element, _step, { driver }) =>
              moveNextFromSidebar(driver, '[data-tour="mobile-meetings"]')
          : undefined,
        onPrevClick: mobile
          ? (_element, _step, { driver }) =>
              movePreviousFromSidebar(driver, '[data-tour="mobile-archive"]')
          : undefined,
      }),
      stepWithResponsiveTarget({
        desktop: '[data-tour="meetings"]',
        mobile: '[data-tour="mobile-meetings"]',
        title: "Meet online",
        description:
          "Start or join scheduled academic meetings without leaving IRAAP.",
        side: mobile ? "bottom" : "right",
        align: mobile ? "center" : "start",
        onNextClick: mobile
          ? (_element, _step, { driver }) => closeDrawerAndMoveNext(driver)
          : undefined,
        onPrevClick: mobile
          ? (_element, _step, { driver }) =>
              movePreviousFromSidebar(driver, '[data-tour="mobile-chat"]')
          : undefined,
      }),
      {
        element: '[data-tour="profile"]',
        waitForElement: WAIT_TIMEOUT,
        popover: {
          title: "Manage your profile",
          description:
            "Keep your photo and academic information up to date from your profile menu.",
          side: "bottom",
          align: mobile ? "center" : "end",
          onPrevClick: mobile
            ? async (_element, _step, { driver }) => {
                onOpenSidebar?.();
                await waitForVisible('[data-tour="mobile-meetings"]');
                await sleep(120);
                driver.movePrevious();
              }
            : undefined,
        },
      },
    ];

    const driverObj = driver({
      animate: true,
      duration: 240,
      overlayColor: "rgba(15, 23, 42, 0.56)",
      overlayOpacity: 0.56,
      allowClose: false,
      allowKeyboardControl: true,
      smoothScroll: true,
      showButtons: ["next", "previous"],
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      stagePadding: mobile ? 5 : 8,
      stageRadius: mobile ? 10 : 12,
      popoverOffset: mobile ? 9 : 12,
      popoverClass: "iraap-driver-popover",
      steps,
      onPopoverRender: (popover) => {
        const skip = document.createElement("button");
        skip.type = "button";
        skip.className = "iraap-tour-skip";
        skip.textContent = "Skip tour";
        skip.addEventListener("click", () => driverRef.current?.destroy());
        popover.footerButtons.prepend(skip);
      },
      onDoneClick: () => {
        driverRef.current?.destroy();
      },
      onDestroyed: () => {
        if (!destroyed && !completionHandledRef.current) {
          completionHandledRef.current = true;
          if (isMobileViewport()) onCloseSidebar?.();
          localStorage.setItem(TOUR_KEY, "1");
        }
      },
    });

    driverRef.current = driverObj;

    const boot = async () => {
      await sleep(900);
      if (destroyed || isDisabledRoute()) return;

      if (mobile) {
        onOpenSidebar?.();
        await waitForVisible('[data-tour="mobile-sidebar"]');
      }

      if (!destroyed) driverObj.drive();
    };

    void boot();

    return () => {
      destroyed = true;
      driverObj.destroy();
      driverRef.current = null;
      if (isMobileViewport()) onCloseSidebar?.();
    };
  }, [onCloseSidebar, onOpenSidebar, isDisabledRoute, pathname, viewportMode]);

  // Restart listener API
  useEffect(() => {
    if (isDisabledRoute()) return;

    const handleRestart = () => {
      localStorage.removeItem(TOUR_KEY);
      window.location.reload();
    };

    window.addEventListener("iraap:restart-tour", handleRestart);
    return () =>
      window.removeEventListener("iraap:restart-tour", handleRestart);
  }, [isDisabledRoute]);

  return null;
}
