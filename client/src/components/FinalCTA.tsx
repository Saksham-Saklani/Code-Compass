"use client";

import React from "react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="w-full bg-[#0a0a0a] border-t border-[#33ff00]/10 py-36 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Radial green glow — large, centered, subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[800px] h-[400px] rounded-full bg-[#33ff00] opacity-[0.04] blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center space-y-10 z-10">
        <span className="inline-block px-4 py-1.5 border border-[#33ff00]/25 text-[#33ff00]/70 text-xs font-mono uppercase tracking-[0.18em] rounded-full">
          Get started
        </span>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]">
          Ready to explore<br />
          <span className="text-[#33ff00]">your codebase?</span>
        </h2>

        <p className="text-base font-mono text-[#33ff00]/50 leading-relaxed max-w-sm mx-auto">
          Add a repository URL and start asking questions in under two minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="inline-block px-10 py-4 bg-[#33ff00] text-black font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors duration-150 active:translate-y-px"
          >
            ADD REPOSITORY
          </Link>
          <Link
            href="/guide"
            className="inline-block px-8 py-4 border border-[#33ff00]/30 text-[#33ff00]/70 font-bold text-sm uppercase tracking-widest hover:border-[#33ff00]/60 hover:text-[#33ff00] transition-all duration-150"
          >
            VIEW GUIDE
          </Link>
        </div>
      </div>
    </section>
  );
}
