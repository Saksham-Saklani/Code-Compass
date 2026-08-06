"use client";

import React from "react";
import { GoGitBranch } from "react-icons/go";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdOutlineChat } from "react-icons/md";
import { LuFileStack } from "react-icons/lu";

const FEATURES = [
  {
    icon: <GoGitBranch />,
    title: "Repository Indexing",
    bold: "Connect GitHub repositories",
    rest: " and build a searchable index. Files are chunked into tokens, embedded, and stored in Qdrant.",
  },
  {
    icon: <AiOutlineFileSearch />,
    title: "Semantic Search",
    bold: "Retrieve relevant code",
    rest: " instead of relying on keyword matching. Vector similarity finds the right context every time.",
  },
  {
    icon: <MdOutlineChat />,
    title: "AI-Powered Q&A",
    bold: "Ask questions naturally",
    rest: " and receive context-aware answers. Gemini reads retrieved code to construct precise responses.",
  },
  {
    icon: <LuFileStack />,
    title: "Source References",
    bold: "Every answer includes",
    rest: " the exact files used to generate it, with relevance scores so you know what to trust.",
  },
];

export default function Features() {
  return (
    <section className="w-full bg-[#0E0D0E] border-t border-[#33ff00]/10 py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">

        {/* Centered header */}
        <div className="text-center mb-20 space-y-5">
          <span className="inline-block px-4 py-1.5 border border-[#33ff00]/25 text-[#33ff00]/70 text-xs font-mono uppercase tracking-[0.18em] rounded-full">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Everything you need to<br className="hidden md:block" /> explore a codebase.
          </h2>
        </div>

        {/* 4-cell grid: 2×2 with hairline borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-[#33ff00]/10 border border-[#33ff00]/10 overflow-hidden">
          {FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              className={`relative p-10 md:p-14 pr-32 md:pr-40 space-y-5 group hover:bg-[#33ff00]/[0.025] transition-colors duration-300 overflow-hidden ${
                // right column: left border; bottom row: top border
                i % 2 === 1 ? "sm:border-l border-[#33ff00]/10" : ""
              } ${
                i >= 2 ? "border-t border-[#33ff00]/10" : ""
              }`}
            >
              {/* Large background watermark icon on the right side */}
              <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-8xl md:text-9xl text-[#33ff00]/10 group-hover:text-[#33ff00]/30 transition-all duration-300 pointer-events-none select-none">
                {feat.icon}
              </div>

              <h3 className="text-lg font-bold text-white tracking-wide relative z-10">
                {feat.title}
              </h3>

              <p className="text-sm font-mono text-[#33ff00]/55 leading-relaxed relative z-10">
                <span className="text-[#33ff00]/80 font-semibold">{feat.bold}</span>
                {feat.rest}
              </p>

              {/* hover underline */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-[#33ff00]/40 group-hover:w-full transition-all duration-500 ease-out" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
