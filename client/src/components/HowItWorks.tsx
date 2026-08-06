"use client";

import React, { useState } from "react";
import {
  PiPlusCircleBold,
  PiGear,
  PiChatCenteredText,
} from "react-icons/pi";
import { FaGithub } from "react-icons/fa";

const STEPS = [
  {
    id: "step1",
    num: "01",
    title: "Add a repository",
    desc: "Paste any public GitHub URL. Code Compass fetches the file tree, filters noise, and queues processing automatically.",
    icon: <FaGithub className="text-6xl" />,
  },
  {
    id: "step2",
    num: "02",
    title: "Automatic indexing",
    desc: "Files are chunked into tokens, converted to vector embeddings, and stored in Qdrant. Status moves PENDING → INDEXING → COMPLETED.",
    icon: <PiGear className="text-6xl" />,
  },
  {
    id: "step3",
    num: "03",
    title: "Ask anything",
    desc: "Type a question in plain English. Relevant code chunks are retrieved semantically, then Gemini constructs a precise, cited answer.",
    icon: <PiChatCenteredText className="text-6xl" />,
  },
];

export default function HowItWorks() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#0a0a0a] py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-terminal-grid opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Centered header */}
        <div className="text-center mb-24 space-y-5">
          <span className="inline-block px-4 py-1.5 border border-[#33ff00]/25 text-[#33ff00]/70 text-xs font-mono uppercase tracking-[0.18em] rounded-full">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Three steps to understand<br className="hidden md:block" /> any codebase.
          </h2>
        </div>

        {/* Desktop/Tablet Timeline (Horizontal) */}
        <div className="hidden md:block relative w-full mb-12">
          {/* Horizontal connecting line */}
          <div className="absolute top-[34px] left-[16.6%] right-[16.6%] h-[2px] bg-[#33ff00]/15 z-0" />

          {/* Grid layout for alignment */}
          <div className="grid grid-cols-3 relative z-10">
            {STEPS.map((step, idx) => {
              const isHovered = hoveredIdx === idx;
              // Highlight the first step by default if nothing is hovered, or highlight hovered item
              const isActive = hoveredIdx === null ? idx === 0 : isHovered;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center px-6 group cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Circle Node */}
                  <div
                    className={`w-[110px] h-[110px] rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-[#0a0a0a] 
                      ${
                      isActive
                        ? "border-[#33ff00] text-[#33ff00] shadow-[0_0_20px_rgba(51,255,0,0.3)] scale-110"
                        : "border-white/10 text-white/40"
                    }
                    `}
                  >
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-lg font-bold uppercase tracking-wider mt-8 mb-4 transition-colors duration-300 ${
                      isActive ? "text-[#33ff00] glow-text" : "text-white"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm font-mono text-[#33ff00]/50 leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="md:hidden relative space-y-12 pl-8">
          {/* Vertical connecting line */}
          <div className="absolute top-2 bottom-2 left-[19px] w-[2px] bg-[#33ff00]/15 z-0" />

          {STEPS.map((step, idx) => (
            <div key={step.id} className="relative flex flex-col items-start gap-4 z-10">
              {/* Circle Node */}
              <div className="absolute -left-[29px] w-[40px] h-[40px] rounded-full flex items-center justify-center border-2 border-[#33ff00] bg-[#0a0a0a] text-[#33ff00] shadow-[0_0_10px_rgba(51,255,0,0.2)]">
                {step.icon}
              </div>

              <div className="pl-6 space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  {step.title}
                </h3>
                <p className="text-sm font-mono text-[#33ff00]/50 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
