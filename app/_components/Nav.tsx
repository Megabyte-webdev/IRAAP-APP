"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "../_context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
const navItems = [
  { name: "Archive", href: "/archive" },
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
];
const Nav = () => {
  const { authDetails } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-5xl items-center justify-between px-5 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/irap-logo.png"
            alt="IRAAP"
            width={42}
            height={42}
            className="h-10 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 mr-auto ml-10">
          {navItems.map((item) => {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-primary"
              >
                {item.name}
                <span className="absolute bottom-1 left-4 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-[calc(100%-2rem)]" />
              </Link>
            );
          })}
        </nav>
        {/* Desktop Buttons */}
        {authDetails?.user ? (
          <ProfileDropdown />
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <LogIn className="h-4 w-4" /> Log In
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 md:hidden ${open ? "max-h-96" : "max-h-0"}`}
      >
        <div className="space-y-2 px-5 py-5">
          {navItems.map((item) => {
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-blue-50 hover:text-primary"
              >
                {item.name}
              </Link>
            );
          })}
          <div className="mt-5 space-y-3 border-t border-gray-300 pt-5">
            <Link
              href="/login"
              className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 font-semibold transition hover:bg-gray-50"
            >
              <LogIn className="h-4 w-4" /> Log In
            </Link>
            <Link
              href="/login"
              className=" group w-full md:w-auto bg-primary text-white text-xs font-semibold px-7 py-4 rounded-md shadow-md shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-300 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Nav;
