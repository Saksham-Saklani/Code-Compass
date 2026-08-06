"use client";

import React, { useState } from "react";

const CONVERSATIONS = [
  {
    id: "auth",
    question: "How does authentication work?",
    answer:
      "Authentication uses JWT middleware. When a protected route is hit, `authMiddleware` extracts the token from the Authorization header, verifies it against the secret, and attaches the decoded user to `req.user`. Tokens expire after 24 hours.",
    sources: [
      { file: "middleware/auth.ts", score: 96 },
      { file: "routes/user.route.ts", score: 88 },
      { file: "lib/jwt.ts", score: 84 },
    ],
  }
];

export default function ExampleConversation() {
  const [active, setActive] = useState(0);
  const conv = CONVERSATIONS[active];

  return (
    <section className="w-full bg-[#0a0a0a] border-t border-[#33ff00]/10 py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">

        {/* Centered header */}
        <div className="text-center mb-20 space-y-5">
          <span className="inline-block px-4 py-1.5 border border-[#33ff00]/25 text-[#33ff00]/70 text-xs font-mono uppercase tracking-[0.18em] rounded-full">
            Example conversation
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            See it in action.
          </h2>
          <p className="text-base font-mono text-[#33ff00]/50 max-w-md mx-auto">
            Real questions. Answers backed by actual source code.
          </p>
        </div>

        {/* Demo panel */}
        <div className="border border-[#33ff00]/15 grid grid-cols-1 lg:grid-cols-[260px_1fr]">

          {/* Left: question list */}
          <div className="border-b lg:border-b-0 lg:border-r border-[#33ff00]/15 p-0">
            <div className="px-6 pt-6 pb-3">
              <p className="text-[10px] font-mono text-[#33ff00]/35 uppercase tracking-widest">
                Sample prompts
              </p>
            </div>
            {CONVERSATIONS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className={`w-full text-left px-6 py-4 text-xs font-mono border-l-2 transition-all duration-150 cursor-pointer flex items-start gap-2.5 ${
                  active === i
                    ? "border-[#33ff00] bg-[#33ff00]/8 text-[#33ff00]"
                    : "border-transparent text-[#33ff00]/40 hover:text-[#33ff00]/70 hover:bg-[#33ff00]/5"
                }`}
              >
                <span className="opacity-40 shrink-0 mt-0.5">&gt;</span>
                <span className="leading-relaxed">{c.question}</span>
              </button>
            ))}
          </div>

          {/* Right: response */}
          <div className="p-8 md:p-10 space-y-8">

            {/* User bubble */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-[#33ff00]/35 uppercase tracking-widest">You</p>
              <div className="inline-block font-mono text-sm text-white/85 bg-[#33ff00]/[0.06] border border-[#33ff00]/15 px-5 py-3">
                {conv.question}
              </div>
            </div>

            {/* AI response */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-mono text-[#33ff00]/35 uppercase tracking-widest">Code Compass</p>
                <span className="inline-block w-1.5 h-3.5 bg-[#33ff00]/50 animate-blink" />
              </div>
              <p className="font-mono text-sm text-[#33ff00]/80 leading-7">
                {conv.answer}
              </p>
            </div>

            {/* Sources */}
            <div className="pt-6 border-t border-[#33ff00]/10 space-y-3">
              <p className="text-[10px] font-mono text-[#33ff00]/35 uppercase tracking-widest">
                Sources
              </p>
              <div className="flex flex-wrap gap-2">
                {conv.sources.map((src) => (
                  <div
                    key={src.file}
                    className="flex items-center gap-2 px-3 py-1.5 border border-[#33ff00]/20 text-xs font-mono text-[#33ff00]/70 hover:border-[#33ff00]/40 hover:text-[#33ff00] transition-colors"
                  >
                    <span className="text-[#33ff00]/40">◇</span>
                    {src.file}
                    <span className="text-[#33ff00]/40 text-[10px]">{src.score}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
