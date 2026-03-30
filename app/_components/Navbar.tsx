"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../_context/AuthContext";

export default function Navbar() {
  const { authDetails, logout } = useAuth();

  // Get user role for the dashboard link
  const userRole = authDetails?.user?.role?.toLowerCase();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Repository", href: "/repository" },
    { name: "About IRAP", href: "/about" },
    { name: "Archive v2", href: "/archive" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-100 transition-all duration-500 ${
        scrolled
          ? "py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "py-10 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
            <Image
              src="/irap-logo.png"
              width={20}
              height={20}
              alt="Logo"
              className="brightness-0 invert"
            />
          </div>
          <span className="text-slate-900 font-bold tracking-tighter text-xl">
            IRAP
          </span>
        </Link>

        {/* Desktop Navigation Pill */}
        <div
          className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-all duration-500 ${
            scrolled
              ? "bg-slate-100/50 border-slate-200/60"
              : "bg-transparent border-transparent"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-full ${
                scrolled
                  ? "text-slate-600 hover:text-blue-600 hover:bg-white"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-8">
          {authDetails ? (
            /* AUTHENTICATED STATE */
            <>
              <Link
                href={`/${userRole}`}
                className="hidden lg:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>

              <button
                onClick={logout}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                  scrolled
                    ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    : "bg-white text-slate-900 hover:bg-red-600 hover:text-white shadow-slate-200/50"
                }`}
              >
                Logout <LogOut size={14} />
              </button>
            </>
          ) : (
            /* GUEST STATE */
            <>
              <Link
                href="/login"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                  scrolled
                    ? "bg-slate-900 text-white hover:bg-blue-600"
                    : "bg-white text-slate-900 hover:bg-slate-900 hover:text-white shadow-slate-200/50"
                }`}
              >
                Portal <ArrowUpRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
