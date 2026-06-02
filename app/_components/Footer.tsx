"use client";

import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import { BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Repository", href: "#" },
      { label: "Archive v2", href: "#" },
      { label: "API Docs", href: "#" },
      { label: "Status", href: "#" },
    ],
    Community: [
      { label: "GitHub", href: "#", icon: BsGithub },
      { label: "Twitter", href: "#", icon: BsTwitterX },
      { label: "LinkedIn", href: "#", icon: BsLinkedin },
      { label: "Contact", href: "#", icon: Mail },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  };

  return (
    <footer className="relative bg-linear-to-t from-[#0a0f1f] via-[#0f1626] to-[#0a0f1f] border-t border-white/10">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Branding Column */}
          <div className="space-y-6 col-span-1">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <Image
                src="/irap-logo.png"
                alt="IRAP"
                width={100}
                height={40}
                className="object-contain"
              />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              A high-performance institutional research repository engineered
              for precision and scholarly impact.
            </p>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-emerald-500/30 w-fit">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-300 uppercase">
                System Operational
              </span>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link: any) => {
                  const Icon = link?.icon;
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-all duration-300 group"
                      >
                        {Icon && (
                          <Icon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-6 group-hover:ml-0" />
                        )}
                        <span
                          className={
                            Icon
                              ? "group-hover:translate-x-1 transition-transform"
                              : ""
                          }
                        >
                          {link.label}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Bottom Section - Premium */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Copyright */}
          <div className="text-center lg:text-left space-y-2">
            <p className="text-sm text-slate-400">
              © {currentYear} Institutional Research Archive Platform. All
              rights reserved.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              v2.4.1 — Built with precision • Powered by research
            </p>
          </div>

          {/* Tech Stack - Premium */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
            {["Next.js", "TypeScript", "Tailwind", "PostgreSQL"].map((tech) => (
              <div
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-blue-400/30 text-[10px] font-mono text-slate-400 hover:text-blue-300 transition-all duration-300 cursor-default"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
