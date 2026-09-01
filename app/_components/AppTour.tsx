"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  driver,
  type DriveStep,
  type Driver,
  type PopoverDOM,
} from "driver.js";

import "driver.js/dist/driver.css";
import "../tour.css";

interface AppTourProps {
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
}

type Direction = "next" | "previous";

const TOUR_KEY = "iraap_tour_completed";

const MOBILE_BREAKPOINT = 1024;

const WAIT_TIMEOUT = 5000;

const SIDEBAR_OPEN_DELAY = 420;

const NAVIGATION_GUARD = 220;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

const isVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();

  const styles = window.getComputedStyle(element);

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    styles.display !== "none" &&
    styles.visibility !== "hidden" &&
    styles.opacity !== "0"
  );
};

/**
 * Always query the DOM at the moment the target
 * is needed. This is especially important for
 * the mobile sidebar because its visibility changes
 * asynchronously after the React state update.
 */
const waitForTarget = async (
  selector: string,
  timeout = WAIT_TIMEOUT,
): Promise<HTMLElement | null> => {
  const started = Date.now();

  while (Date.now() - started < timeout) {
    const element = document.querySelector(selector) as HTMLElement | null;

    if (element && isVisible(element)) {
      return element;
    }

    await sleep(50);
  }

  return null;
};

/**
 * Wait only for React/browser paint.
 *
 * We intentionally do NOT wait for the sidebar
 * navigation elements to disappear because the
 * sidebar may be hidden with CSS transforms while
 * remaining in the DOM.
 */
const nextPaint = async () => {
  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
};

const navigationDescription = (label: string): string => {
  const descriptions: Record<string, string> = {
    Dashboard: "Your main workspace for seeing what needs your attention.",

    Research: "Manage the research work available to your account.",

    Projects: "Create and track your academic projects and their progress.",

    Approvals: "Review work waiting for supervisor or administrator approval.",

    Chat: "Communicate with supervisors, collaborators, and other members of IRAAP.",

    Meetings: "Access and manage your scheduled academic meetings.",

    Students: "View and manage students available to your role.",

    Supervisors: "View and manage supervisors when your role allows it.",

    Publications: "Submit and manage standalone academic publications.",

    "Archive Search":
      "Search and explore approved academic work in the repository.",
  };

  return descriptions[label] ?? `Open ${label} from your IRAAP workspace.`;
};

export default function AppTour({
  onOpenSidebar,
  onCloseSidebar,
}: AppTourProps) {
  const pathname = usePathname();

  /**
   * Keep the latest callbacks without allowing
   * their identity to recreate Driver.js.
   */
  const callbacksRef = useRef({
    onOpenSidebar,
    onCloseSidebar,
  });

  /**
   * Current path.
   */
  const pathnameRef = useRef(pathname);

  /**
   * ONLY active Driver.js instance.
   */
  const driverRef = useRef<Driver | null>(null);

  /**
   * Whether the current tour is mobile.
   */
  const mobileRef = useRef(false);

  /**
   * Prevent duplicate tour starts.
   */
  const startingRef = useRef(false);

  /**
   * Prevent multiple async Next/Back transitions
   * from being executed at the same time.
   */
  const busyRef = useRef(false);

  /**
   * Only true when the user explicitly finishes
   * or skips the tour.
   */
  const completedRef = useRef(false);

  /**
   * Resize refresh frame.
   */
  const resizeFrameRef = useRef<number | null>(null);

  /**
   * Breakpoint resize timer.
   */
  const resizeTimerRef = useRef<number | null>(null);

  /**
   * Keep callback refs current.
   */
  useEffect(() => {
    callbacksRef.current = {
      onOpenSidebar,
      onCloseSidebar,
    };
  }, [onOpenSidebar, onCloseSidebar]);

  /**
   * Keep route ref current.
   */
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    /**
     * Routes where the normal dashboard tour
     * should not run.
     */
    const disabledRoute = () => {
      const path = pathnameRef.current ?? "";

      return (
        path.includes("/room") ||
        path.includes("/waiting") ||
        path.includes("/profile")
      );
    };

    /**
     * ----------------------------------------------------
     * OPEN MOBILE SIDEBAR
     * ----------------------------------------------------
     */
    const openSidebar = async () => {
      callbacksRef.current.onOpenSidebar?.();

      await sleep(SIDEBAR_OPEN_DELAY);

      await nextPaint();
    };

    /**
     * ----------------------------------------------------
     * CLOSE MOBILE SIDEBAR
     * ----------------------------------------------------
     *
     * IMPORTANT:
     * There is intentionally no waitForHidden() here.
     */
    const closeSidebar = async () => {
      callbacksRef.current.onCloseSidebar?.();

      /**
       * Allow React to commit the new sidebar
       * state and let the browser paint it.
       */
      await nextPaint();
    };

    /**
     * ----------------------------------------------------
     * REFRESH CURRENT POPOVER
     * ----------------------------------------------------
     */
    const refreshCurrent = () => {
      if (resizeFrameRef.current !== null) {
        return;
      }

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        resizeFrameRef.current = null;

        const current = driverRef.current;

        if (current?.isActive()) {
          current.refresh();
        }
      });
    };

    /**
     * ----------------------------------------------------
     * MOVE TOUR
     * ----------------------------------------------------
     */
    const moveTour = async (direction: Direction) => {
      const current = driverRef.current;

      if (!current?.isActive()) {
        return;
      }

      if (busyRef.current) {
        return;
      }

      busyRef.current = true;

      try {
        const currentIndex = current.getActiveIndex() ?? 0;

        const steps = current.getConfig().steps ?? [];

        const targetIndex =
          direction === "next" ? currentIndex + 1 : currentIndex - 1;

        if (targetIndex < 0 || targetIndex >= steps.length) {
          return;
        }

        const targetStep = steps[targetIndex];

        if (!targetStep) {
          return;
        }

        const selector =
          typeof targetStep.element === "string" ? targetStep.element : null;

        const mobile = mobileRef.current;

        const targetIsMenu = mobile && selector === '[data-tour="mobile-menu"]';

        const targetIsProfile = mobile && selector === '[data-tour="profile"]';

        const targetIsNav =
          mobile && !!selector && selector.includes("data-tour-nav-index");

        /**
         * ------------------------------------------------
         * MENU -> FIRST NAVIGATION ITEM
         * ------------------------------------------------
         *
         * Open sidebar FIRST.
         */
        if (direction === "next" && targetIsNav) {
          await openSidebar();

          const target = await waitForTarget(selector!);

          if (!target || !current.isActive()) {
            return;
          }

          target.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          });

          await nextPaint();

          if (current.isActive()) {
            current.moveNext();

            await nextPaint();

            current.refresh();
          }

          return;
        }

        /**
         * ------------------------------------------------
         * FIRST NAVIGATION ITEM -> MENU
         * ------------------------------------------------
         *
         * Close sidebar FIRST.
         */
        if (direction === "previous" && targetIsMenu) {
          await closeSidebar();

          if (!current.isActive()) {
            return;
          }

          const menu = await waitForTarget('[data-tour="mobile-menu"]');

          if (!menu) {
            return;
          }

          current.movePrevious();

          await nextPaint();

          if (current.isActive()) {
            current.refresh();
          }

          return;
        }

        /**
         * ------------------------------------------------
         * LAST NAVIGATION ITEM -> PROFILE
         * ------------------------------------------------
         *
         * Close sidebar FIRST.
         *
         * No long wait.
         */
        if (direction === "next" && targetIsProfile) {
          await closeSidebar();

          if (!current.isActive()) {
            return;
          }

          const profile = await waitForTarget('[data-tour="profile"]');

          if (!profile) {
            return;
          }

          current.moveNext();

          await nextPaint();

          if (current.isActive()) {
            current.refresh();
          }

          return;
        }

        /**
         * ------------------------------------------------
         * PROFILE -> LAST NAVIGATION ITEM
         * ------------------------------------------------
         *
         * Open sidebar FIRST.
         */
        if (direction === "previous" && targetIsNav) {
          await openSidebar();

          const target = await waitForTarget(selector!);

          if (!target || !current.isActive()) {
            return;
          }

          target.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          });

          await nextPaint();

          current.movePrevious();

          await nextPaint();

          if (current.isActive()) {
            current.refresh();
          }

          return;
        }

        /**
         * ------------------------------------------------
         * NORMAL DRIVER.JS NAVIGATION
         * ------------------------------------------------
         */
        if (direction === "next") {
          current.moveNext();
        } else {
          current.movePrevious();
        }

        await nextPaint();

        if (current.isActive()) {
          current.refresh();
        }
      } finally {
        window.setTimeout(() => {
          busyRef.current = false;
        }, NAVIGATION_GUARD);
      }
    };

    /**
     * ----------------------------------------------------
     * CREATE TOUR
     * ----------------------------------------------------
     */
    const createTour = async (startIndex = 0) => {
      if (startingRef.current || driverRef.current) {
        return;
      }

      if (disabledRoute()) {
        return;
      }

      if (localStorage.getItem(TOUR_KEY) === "1") {
        return;
      }

      startingRef.current = true;

      completedRef.current = false;

      busyRef.current = false;

      mobileRef.current = isMobileViewport();

      const mobile = mobileRef.current;

      try {
        /**
         * Allow dashboard layout to render.
         */
        await sleep(450);

        const sidebar = await waitForTarget('[data-tour="sidebar"]');

        const profile = await waitForTarget('[data-tour="profile"]');

        if (!sidebar || !profile) {
          return;
        }

        /**
         * Read only the navigation items that
         * actually exist in this user's sidebar.
         *
         * This automatically respects user role.
         */
        const navigationElements = Array.from(
          sidebar.querySelectorAll<HTMLElement>("[data-tour-nav-index]"),
        );

        if (navigationElements.length === 0) {
          return;
        }

        const steps: DriveStep[] = [];

        /**
         * -----------------------------------------------
         * STEP 0 — WELCOME
         * -----------------------------------------------
         */
        steps.push({
          popover: {
            title: "Welcome to IRAAP",

            description:
              "A quick guide to your academic workspace and the tools available to you.",

            align: "center",
          },
        });

        /**
         * -----------------------------------------------
         * STEP 1 — WORKSPACE ENTRY
         * -----------------------------------------------
         *
         * Desktop:
         * highlight full sidebar.
         *
         * Mobile:
         * highlight menu.
         */
        if (mobile) {
          steps.push({
            element: '[data-tour="mobile-menu"]',

            popover: {
              title: "Your workspace menu",

              description:
                "Use this menu to open your workspace navigation on smaller screens.",

              side: "bottom",

              align: "start",

              onNextClick: () => {
                void moveTour("next");
              },

              onPrevClick: () => {
                void moveTour("previous");
              },
            },
          });
        } else {
          steps.push({
            element: '[data-tour="sidebar"]',

            popover: {
              title: "Your workspace",

              description:
                "This sidebar is your workspace navigation. We'll guide you through every section available to your account.",

              side: "right",

              align: "start",
            },
          });
        }

        /**
         * -----------------------------------------------
         * NAVIGATION
         * -----------------------------------------------
         */
        navigationElements.forEach((element, index) => {
          const label = element.dataset.tourNav?.trim() || "Navigation";

          const isFirst = index === 0;

          const isLast = index === navigationElements.length - 1;

          const step: DriveStep = {
            element: `[data-tour-nav-index="${index}"]`,

            popover: {
              title: label,

              description: navigationDescription(label),

              side: "right",

              align: "start",
            },
          };

          /**
           * Mobile first navigation:
           *
           * Back -> close sidebar -> menu
           */
          if (mobile && isFirst) {
            step.popover = {
              ...step.popover,
              onPrevClick: () => {
                void moveTour("previous");
              },
            };
          }

          /**
           * Mobile last navigation:
           *
           * Next -> close sidebar -> profile
           */
          if (mobile && isLast) {
            step.popover = {
              ...step.popover,
              onNextClick: () => {
                void moveTour("next");
              },
            };
          }

          steps.push(step);
        });

        /**
         * -----------------------------------------------
         * PROFILE
         * -----------------------------------------------
         */
        const profileStep: DriveStep = {
          element: '[data-tour="profile"]',

          popover: {
            title: "Your profile",

            description:
              "Manage your profile information and account options here.",

            side: "bottom",

            align: "end",
          },
        };

        /**
         * Mobile:
         *
         * Back -> open sidebar -> last navigation
         */
        if (mobile) {
          profileStep.popover = {
            ...profileStep.popover,
            onPrevClick: () => {
              void moveTour("previous");
            },
          };
        }

        steps.push(profileStep);

        /**
         * -----------------------------------------------
         * DRIVER INSTANCE
         * -----------------------------------------------
         */
        const tour = driver({
          steps,

          animate: true,

          duration: 180,

          smoothScroll: true,

          allowClose: false,

          allowKeyboardControl: true,

          overlayColor: "rgba(15, 23, 42, 0.66)",

          overlayOpacity: 0.66,

          stagePadding: mobile ? 6 : 10,

          stageRadius: mobile ? 9 : 12,

          popoverOffset: mobile ? 8 : 12,

          showButtons: ["previous", "next"],

          showProgress: true,

          progressText: "{{current}} / {{total}}",

          nextBtnText: "Next",

          prevBtnText: "Back",

          doneBtnText: "Finish",

          popoverClass: "iraap-driver-popover",

          onPopoverRender: (popover: PopoverDOM) => {
            if (popover.wrapper.querySelector(".iraap-tour-skip")) {
              return;
            }

            const skip = document.createElement("button");

            skip.type = "button";

            skip.className = "iraap-tour-skip";

            skip.textContent = "Skip";

            skip.addEventListener("click", () => {
              completedRef.current = true;

              localStorage.setItem(TOUR_KEY, "1");

              tour.destroy();
            });

            popover.footerButtons.prepend(skip);
          },

          onDoneClick: () => {
            completedRef.current = true;

            localStorage.setItem(TOUR_KEY, "1");

            tour.destroy();
          },

          onDestroyed: () => {
            callbacksRef.current.onCloseSidebar?.();

            if (driverRef.current === tour) {
              driverRef.current = null;
            }

            busyRef.current = false;

            if (completedRef.current) {
              localStorage.setItem(TOUR_KEY, "1");
            }
          },
        });

        /**
         * Store the ONE instance.
         */
        driverRef.current = tour;

        /**
         * Start with mobile sidebar closed.
         */
        if (mobile) {
          callbacksRef.current.onCloseSidebar?.();

          await nextPaint();
        }

        /**
         * Initial Driver start.
         */
        if (startIndex === 0) {
          tour.drive();
        } else {
          tour.drive(startIndex);
        }
      } finally {
        startingRef.current = false;
      }
    };

    /**
     * ----------------------------------------------------
     * RESIZE HANDLING
     * ----------------------------------------------------
     */
    const handleResize = () => {
      const current = driverRef.current;

      if (!current?.isActive()) {
        return;
      }

      const nextMobile = isMobileViewport();

      /**
       * Same breakpoint:
       *
       * Never destroy the tour.
       */
      if (nextMobile === mobileRef.current) {
        refreshCurrent();

        return;
      }

      /**
       * Desktop <-> mobile breakpoint.
       *
       * Preserve active step.
       */
      const activeIndex = current.getActiveIndex() ?? 0;

      mobileRef.current = nextMobile;

      busyRef.current = false;

      completedRef.current = false;

      callbacksRef.current.onCloseSidebar?.();

      /**
       * Remove the old popover before creating
       * the target configuration for the new layout.
       */
      current.destroy();

      driverRef.current = null;

      if (resizeTimerRef.current !== null) {
        window.clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = window.setTimeout(() => {
        resizeTimerRef.current = null;

        void createTour(activeIndex);
      }, 100);
    };

    /**
     * ----------------------------------------------------
     * RESTART TOUR
     * ----------------------------------------------------
     */
    const handleRestart = () => {
      localStorage.removeItem(TOUR_KEY);

      completedRef.current = false;

      busyRef.current = false;

      callbacksRef.current.onCloseSidebar?.();

      driverRef.current?.destroy();

      driverRef.current = null;

      window.setTimeout(() => {
        void createTour(0);
      }, 100);
    };

    window.addEventListener("resize", handleResize, {
      passive: true,
    });

    window.addEventListener("iraap:restart-tour", handleRestart);

    /**
     * Initial start.
     */
    void createTour(0);

    /**
     * ----------------------------------------------------
     * CLEANUP
     * ----------------------------------------------------
     */
    return () => {
      window.removeEventListener("resize", handleResize);

      window.removeEventListener("iraap:restart-tour", handleRestart);

      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);

        resizeFrameRef.current = null;
      }

      if (resizeTimerRef.current !== null) {
        window.clearTimeout(resizeTimerRef.current);

        resizeTimerRef.current = null;
      }

      startingRef.current = false;

      busyRef.current = false;

      /**
       * Cleanup is NOT completion.
       */
      completedRef.current = false;

      callbacksRef.current.onCloseSidebar?.();

      driverRef.current?.destroy();

      driverRef.current = null;
    };

    /**
     * The Driver lifecycle intentionally runs once.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
