"use client";

import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { MdOutlineDashboard } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "../_context/AuthContext";
import { getInitials } from "../_utils/formatters";
import { getDashboardRole } from "../_utils/roleRouting";

interface UserProfile {
  profileImage?: string;
  profileImageUrl?: string;
}

interface User {
  fullName?: string;
  name?: string;
  role?: string;
  profile?: UserProfile;
  profileImageUrl?: string;
  organizationRole?: string;
  organizationName?: string;
}

interface ProfileDropdownProps {
  fullMode?: boolean;
}

const ProfileDropdown = ({ fullMode = false }: ProfileDropdownProps) => {
  const { authDetails, logout, isLoggingOut } = useAuth();
  const user = authDetails?.user as User | undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileImage =
    user?.profileImageUrl ||
    user?.profile?.profileImageUrl ||
    user?.profile?.profileImage;

  if (!user) return null;

  const effectiveRole = getDashboardRole(user) || "student";

  return (
    <div className="relative text-slate-700 dark:text-slate-300">
      {/* Trigger Button */}
      <div
        data-tour="profile"
        className="flex items-center gap-2 ml-2 font-medium cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {fullMode && (
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Hello,{" "}
            {(user?.fullName && user.fullName.length > 7
              ? `${user.fullName.slice(0, 7)}...`
              : user?.fullName) || "User"}
          </p>
        )}

        <div className="flex items-center rounded-full bg-slate-200/50 dark:bg-slate-800/60 w-max p-1 transition-colors">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-600 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
            {profileImage ? (
              <img
                src={profileImage}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials(user?.fullName || user?.name || "")}</span>
            )}
          </div>

          <span className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
            <IoIosArrowDown
              size={18}
              className={`transition-transform duration-200 ${isOpen ? "-rotate-180" : ""}`}
            />
          </span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop Overlay for closing */}
          <div
            className="fixed inset-0 z-50 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute z-51 right-0 mt-2 w-48 bg-white dark:bg-[#1E293B] font-medium border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
            <ul className="text-sm text-slate-700 dark:text-slate-300">
              {user.organizationName && (
                <li className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Organization</p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-800 dark:text-white">{user.organizationName}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{user.organizationRole || "Member"}</p>
                </li>
              )}
              {/* Dashboard Link - Based on Role */}
              <Link
                href={`/${effectiveRole}`}
                className="px-4 py-2.5 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <MdOutlineDashboard
                  size={18}
                  className="text-slate-400 dark:text-slate-500"
                />
                Dashboard
              </Link>

              {/* Profile Link */}
              <Link
                href={`/${effectiveRole}/profile`}
                className="px-4 py-2.5 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiUser
                  size={18}
                  className="text-slate-400 dark:text-slate-500"
                />
                Profile
              </Link>

              <button
                type="button"
                className="w-full px-4 py-2.5 flex items-center gap-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                onClick={() => {
                  localStorage.removeItem("iraap_tour_completed");
                  window.dispatchEvent(new Event("iraap:restart-tour"));
                  setIsOpen(false);
                }}
              >
                <span className="h-4.5 w-4.5 rounded-full border border-slate-300 dark:border-slate-600 text-[10px] flex items-center justify-center font-bold">
                  ?
                </span>
                Take a tour
              </button>

              <hr className="my-1 border-slate-100 dark:border-slate-800" />

              {/* Logout Handler */}
              <li
                className="px-4 py-2.5 flex items-center gap-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors"
                onClick={() => {
                  if (isLoggingOut) return;
                  setIsOpen(false);
                  setShowLogoutConfirm(true);
                }}
              >
                {isLoggingOut ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FiLogOut size={18} />
                )}
                {isLoggingOut ? "Signing out…" : "Logout"}
              </li>
            </ul>
          </div>
        </>
      )}

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#172033]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                <FiLogOut size={18} />
              </div>
              <div className="min-w-0">
                <h2 id="logout-confirm-title" className="text-base font-semibold text-slate-900 dark:text-white">
                  Log out of IRAAP?
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  You’ll be signed out on this device and push notifications will be disabled for this session.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={async () => {
                  await logout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isLoggingOut && <Loader2 size={16} className="animate-spin" />}
                {isLoggingOut ? "Signing out…" : "Yes, log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
