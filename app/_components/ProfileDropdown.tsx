"use client";

import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "../_context/AuthContext";
import { getInitials } from "../_utils/formatters";

interface UserProfile {
  profileImage?: string;
}

interface User {
  fullName?: string;
  name?: string;
  role?: string;
  profile?: UserProfile;
}

interface ProfileDropdownProps {
  fullMode?: boolean;
}

const ProfileDropdown = ({ fullMode = false }: ProfileDropdownProps) => {
  const { authDetails, logout } = useAuth();
  const user = authDetails?.user as User | undefined;
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative text-slate-700 dark:text-slate-300">
      {/* Trigger Button */}
      <div
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
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden bg-slate-600 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
            {user?.profile?.profileImage ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${user.profile.profileImage}`}
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
              {/* Dashboard Link - Based on Role */}
              <Link
                href={`/${user?.role?.toLowerCase()}`}
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
                href="/app/profile"
                className="px-4 py-2.5 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiUser
                  size={18}
                  className="text-slate-400 dark:text-slate-500"
                />
                Profile
              </Link>

              <hr className="my-1 border-slate-100 dark:border-slate-800" />

              {/* Logout Handler */}
              <li
                className="px-4 py-2.5 flex items-center gap-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
              >
                <FiLogOut size={18} />
                Logout
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
