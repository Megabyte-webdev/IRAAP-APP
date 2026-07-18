"use client";

import { GraduationCap, ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div
      style={{
        background:
          "radial-gradient(105.7% 113.5% at 50% 0%, #EBF6FD 0%, #FFFFFF 70%)",
      }}
    >
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center space-x-1.5 rounded-xl border border-[#C2E3FA] px-3.5 py-1 text-[10px] md:text-xs font-semibold text-[#FFC107] mb-2.5 bg-white/60 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-blue-100">
          <GraduationCap
            size={14}
            className="transition-transform duration-300 group-hover:rotate-6"
          />
          <span>Designed exclusively for OOU Computer Engineering</span>
        </div>

        <h1 className="mx-auto text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-black">
          The Central Hub for OOU Computer Engineering Research
        </h1>

        <p className="mt-6 mx-auto max-w-150 text-base leading-relaxed text-gray-600">
          Search thousands of past projects, manage your current milestones, and
          collaborate seamlessly with your supervisor in one centralized, secure
          archive system designed specifically for our department.
        </p>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group w-full md:w-auto bg-primary text-white text-xs font-semibold px-7 py-4 rounded-md shadow-md shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-300 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/30 flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <button className="group w-full md:w-auto border border-primary bg-transparent text-primary text-xs font-semibold px-7 py-4 rounded-lg transition-all duration-300 hover:bg-primary/5 hover:border-primary hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-center gap-2">
            <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span>Explore Global Archives</span>
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          <Image
            src="/dashboard_preview.png"
            alt="preview"
            width={1200}
            height={700}
            className="w-full transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:drop-shadow-2xl"
          />
        </div>
      </section>
    </div>
  );
}
