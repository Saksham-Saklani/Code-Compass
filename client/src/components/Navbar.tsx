"use client";

import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#000000] text-[#33ff00] font-mono border-b border-[#1f521f] select-none relative z-50">
      <div className="w-full px-30 h-20 flex items-center justify-between relative">
        
        {/* START: logo / prompt */}
        <div className="flex items-center gap-2 font-bold tracking-wider text-2xl">
          <span className="text-[#33ff00]">&gt;</span>
          <Link href="/" className="hover:text-[#ffb000] transition-colors duration-150 uppercase tracking-widest">
            CODE COMPASS
          </Link>
        </div>

        {/* MID: navigation links */}
        <div className="hidden md:flex items-center gap-20 text-xl absolute left-1/2 -translate-x-1/2">
          <Link 
            href="/dashboard" 
            className="px-2 py-0.5 transition-all duration-150 hover:bg-[#33ff00] hover:text-black"
          >
            Dashboard
          </Link>
          <Link 
            href="/workspace" 
            className="px-2 py-0.5 transition-all duration-150 hover:bg-[#33ff00] hover:text-black"
          >
            Workspace
          </Link>
          <Link 
            href="/guide" 
            className="px-2 py-0.5 transition-all duration-150 hover:bg-[#33ff00] hover:text-black"
          >
            Guide
          </Link>
        </div>

        {/* END: login button */}
        <div className="flex items-center">
          <button 
            className="relative px-4 py-3 border border-dashed border-[#33ff00] text-xl sm:text-sm font-bold tracking-widest uppercase hover:bg-[#33ff00] hover:text-black hover:shadow-[0_0_10px_rgba(51,255,0,0.5)] transition-all duration-150 active:translate-y-0.5"
            onClick={() => console.log("System Login initiated...")}
          >
            [ LOGIN ]
          </button>
        </div>

      </div>
    </nav>
  );
}
