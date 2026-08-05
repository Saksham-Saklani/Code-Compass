"use client";

import React from "react";

interface AddRepoBarProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  submitting: boolean;
  formMessage: { text: string; type: "success" | "error" | "info" } | null;
  onSubmit: (e: React.SyntheticEvent) => void;
}

export default function AddRepoBar({
  repoUrl,
  setRepoUrl,
  submitting,
  formMessage,
  onSubmit,
}: AddRepoBarProps) {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-2 mb-10 pt-4">
      <form onSubmit={onSubmit} className="relative w-full p-[1px] rounded-full overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/5 shadow-xl">
        {/* Large Rotating Gradient Layer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[1500%] -z-10 bg-[conic-gradient(from_0deg,#33ff00_15%,transparent_40%)] animate-[spin_3s_linear_infinite] pointer-events-none" />
        
        <div className="w-full bg-[#0e0d0e]/95 rounded-full p-1.5 pl-5 flex items-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
          <input
            type="url"
            placeholder="Enter GitHub Repository URL..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full bg-transparent text-[#33ff00] text-sm md:text-base placeholder-[#33ff00]/40 outline-none pr-4 font-sans"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#33ff00] text-black font-bold px-6 py-2 rounded-full hover:bg-white hover:shadow-[0_0_10px_rgba(51,255,0,0.4)] transition-all duration-300 text-xs uppercase cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {submitting ? "Adding..." : "ADD"}
          </button>
        </div>
      </form>

      {formMessage && (
        <div
          className={`text-[10px] text-center px-4 ${
            formMessage.type === "error"
              ? "text-red-500"
              : formMessage.type === "success"
                ? "text-[#33ff00]"
                : "text-[#ffb000]"
          }`}
        >
          &gt; {formMessage.text}
        </div>
      )}
    </div>
  );
}
