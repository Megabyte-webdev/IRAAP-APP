"use client";

import Link from "next/link";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../_context/AuthContext";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { authDetails } = useAuth();

  return (
    <header className="w-full fixed top-0 z-999 border-b bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/irap-logo.png"
            alt="IRAP"
            width={120}
            height={40}
            className="object-contain h-12"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/repository"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Repository
          </Link>

          <Link
            href="/archive"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Archive
          </Link>

          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg border flex items-center justify-center"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {authDetails?.user ? (
            <ProfileDropdown />
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg border"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
