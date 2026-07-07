import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md"; // Added dashboard icon
import { FaPowerOff } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "../_context/AuthContext";
import { getInitials } from "../_utils/formatters";

const ProfileDropdown = ({ fullMode = false }) => {
  const { authDetails } = useAuth();
  const user = authDetails?.user;
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  if (!user) return null;

  return (
    <div className="relative text-gray-700">
      <div
        className="flex items-center gap-2 ml-2 font-medium cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {fullMode && (
          <p className="text-sm">
            Hello,{" "}
            {(user?.fullName?.length > 7
              ? `${user?.fullName?.slice(0, 7)}...`
              : user?.fullName) || "User"}
          </p>
        )}
        <div className="flex items-center rounded-full bg-gray-200/50 w-max p-1">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center text-xs font-semibold text-gray-200">
            {user?.profile?.profileImage ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${user.profile.profileImage}`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials(user?.fullName || user?.name)}</span>
            )}
          </div>

          <span className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center">
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
          <div
            className="absolute inset-0 z-999"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute z-1000 right-0 mt-2 w-48 bg-white font-medium border border-gray-100 rounded-xl shadow-xl overflow-hidden">
            <ul className=" text-sm text-gray-700">
              {/* Dashboard Link - Based on Role */}
              <Link
                href={`/${user?.role?.toLowerCase()}`}
                className="px-4 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <MdOutlineDashboard size={18} className="text-gray-400" />
                Dashboard
              </Link>

              <Link
                href="/app/profile"
                className="px-4 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiUser size={18} className="text-gray-400" /> Profile
              </Link>
              <hr className="my-1 border-gray-200" />

              <li
                className="px-4 py-2.5 flex items-center gap-2 text-red-500 hover:bg-red-100 cursor-pointer transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  logout.mutate();
                }}
              >
                <FiLogOut size={18} /> Logout
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
