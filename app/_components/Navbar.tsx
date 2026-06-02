"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Repository", href: "/repository", icon: "📚" },
    { name: "About IRAP", href: "/about", icon: "ℹ️" },
    { name: "Archive v2", href: "/archive", icon: "🗂️" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        scrolled
          ? "py-3 bg-[#0a0f1f]/80 backdrop-blur-2xl shadow-2xl shadow-blue-950/10 border-b border-blue-400/10"
          : "py-6 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
        {/* Logo - Premium Version */}
        <Link href="/" className="flex items-center group relative">
          <Image
            src="/irap-logo.png"
            alt="IRAP"
            width={100}
            height={40}
            className="h-12 object-contain"
          />
        </Link>

        {/* Desktop Navigation - Premium Pill Design */}
        <div
          className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-500 backdrop-blur-md ${
            scrolled
              ? "bg-white/5 border-blue-400/20 shadow-lg shadow-blue-500/5"
              : "bg-white/3 border-white/10"
          }`}
        >
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300 hover:text-white transition-all rounded-lg overflow-hidden"
            >
              {/* Hover background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg" />
              <span className="relative flex items-center gap-2">
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Action Buttons - Premium Style */}
        <div className="flex items-center gap-4">
          {/* CTA Button */}
          <Link
            href="/login"
            className="group relative hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 active:scale-95 overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            {/* Animated border */}
            <div className="absolute inset-0 border border-blue-400/30 rounded-xl group-hover:border-blue-400/60 transition-all duration-500" />
            <span className="relative text-white flex items-center gap-2">
              Portal{" "}
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0f1f]/95 backdrop-blur-xl border-b border-blue-400/10 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
