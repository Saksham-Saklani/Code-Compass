"use client";

import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="w-full fixed top-4 z-50 flex justify-center px-6 md:px-20 pointer-events-none">
      <nav className="w-full max-w-7xl bg-black/70 backdrop-blur-xl text-[#33ff00] rounded-full font-mono border border-[#1f521f]/50 select-none pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
        <div className="w-full px-6 md:px-10 h-16 flex items-center justify-between relative">
          
          {/* START: logo / prompt */}
          <div className="flex items-center gap-2 font-bold tracking-wider text-lg md:text-xl">
            <span className="text-[#33ff00]">&gt;</span>
            <Link href="/" className="hover:text-[#ffb000] transition-colors duration-150 uppercase tracking-widest">
              CODE COMPASS
            </Link>
          </div>

          {/* MID: navigation links */}
          <div className="hidden md:flex items-center gap-10 text-base absolute left-1/2 -translate-x-1/2">
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
              className="relative px-3 py-1.5 border border-dashed border-[#33ff00] text-xs font-bold tracking-widest uppercase hover:bg-[#33ff00] hover:text-black hover:shadow-[0_0_10px_rgba(51,255,0,0.5)] transition-all duration-150 active:translate-y-0.5"
              onClick={() => console.log("System Login initiated...")}
            >
              [ LOGIN ]
            </button>
          </div>

        </div>
      </nav>
    </div>
  );
}
