"use client";

import React from "react";

const BENEFITS = [
  {
    bold: "Stop searching through hundreds of files",
    rest: " to answer a simple question about how something works.",
  },
  {
    bold: "Understand unfamiliar repositories",
    rest: " in minutes instead of spending days reading through code.",
  },
  {
    bold: "Answers backed by your source code,",
    rest: " not a model's training data or hallucinated guesses.",
  },
  {
    bold: "Works with any public GitHub repository",
    rest: " you already use. No setup, no integration, no config.",
  },
];

export default function Benefits() {
  return (
    <section className="w-full bg-[#0E0D0E] border-t border-[#33ff00]/10 py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: sticky header block */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 border border-[#33ff00]/25 text-[#33ff00]/70 text-xs font-mono uppercase tracking-[0.18em] rounded-full">
              Why it matters
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Built for developers<br />who hate wasting time.
            </h2>
            <p className="text-sm font-mono text-[#33ff00]/50 leading-relaxed max-w-xs">
              Code Compass exists to solve one problem: navigating a codebase you didn't write shouldn't take hours.
            </p>
          </div>

          {/* Right: benefit list with hairline dividers */}
          <div className="divide-y divide-[#33ff00]/10">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-5 py-6 group"
              >
                <span className="text-[#33ff00] font-mono text-base shrink-0 mt-0.5 group-hover:scale-110 transition-transform select-none">
                  ✓
                </span>
                <p className="text-sm font-mono text-[#33ff00]/60 leading-relaxed group-hover:text-[#33ff00]/80 transition-colors">
                  <span className="text-white font-semibold">{b.bold}</span>
                  {b.rest}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
