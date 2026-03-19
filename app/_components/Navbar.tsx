"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // npm install lucide-react
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Repository", href: "/repository" },
    { name: "Login", href: "/login" },
  ];

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 font-roboto">
          <Image src="/irap-logo.jpg" width={60} height={30} alt="IRAP" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-600 hover:text-blue-600 font-medium transition"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/register"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm active:scale-95"
          >
            Submit Project
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl py-6 px-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-slate-700 hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className="block bg-blue-600 text-white text-center px-4 py-3 rounded-xl font-bold shadow-md"
          >
            Submit Project
          </Link>
        </div>
      )}
    </nav>
  );
}
