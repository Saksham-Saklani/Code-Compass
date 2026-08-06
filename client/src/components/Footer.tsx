"use client";

import React from "react";
import Link from "next/link";
import { PiCompassRoseFill } from "react-icons/pi";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspace" },
  { href: "/guide", label: "Guide" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0E0D0E] border-t border-[#33ff00]/10 py-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5 font-mono">
          <PiCompassRoseFill className="text-[#33ff00] text-base" />
          <span className="text-xs font-bold text-[#33ff00]/70 uppercase tracking-[0.2em]">
            Code Compass
          </span>
        </div>

        <nav className="flex items-center gap-8">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-mono text-[#33ff00]/35 hover:text-[#33ff00]/70 transition-colors uppercase tracking-widest"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="text-[10px] font-mono text-[#33ff00]/20 uppercase tracking-widest">
          © {new Date().getFullYear()} Code Compass
        </p>
      </div>
    </footer>
  );
}
