import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";

export default function ExploreSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-125 w-full bg-[#eef7fc] px-6 md:px-16 py-8 text-center select-none font-sans">
      {/* Icon Container */}
      <div className="flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100/50 mb-8 transition-transform duration-300 hover:scale-105">
        <Rocket className="w-7 h-7 text-[#eab308] fill-[#eab308]/10 stroke-[2.5]" />
      </div>

      {/* Main Heading */}
      <h2 className="text-3xl md:text-[32px] font-bold text-primary max-w-3xl leading-tight mb-4">
        Ready to <span className="text-[#eab308]">streamline</span> your final
        year project?
      </h2>

      {/* Subtext Description */}
      <p className="text-primary text-base md:text-lg max-w-xl font-medium leading-relaxed mb-8">
        Join your peers and supervisors on IRAAP. Secure your workspace,
        <br className="hidden sm:inline" /> access the archives, and stay on
        track for graduation.
      </p>

      {/* Action Button */}
      <Link
        href="/login"
        className="group w-full md:w-auto bg-primary text-white text-xs font-semibold px-7 py-4 rounded-md shadow-md shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-300 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/30 flex items-center justify-center gap-2"
      >
        Get Started
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
