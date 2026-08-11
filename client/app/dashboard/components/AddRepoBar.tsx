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
  const [shouldShake, setShouldShake] = React.useState(false);
  const isError = formMessage?.type === "error";

  React.useEffect(() => {
    if (isError) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 350);
      return () => clearTimeout(timer);
    }
  }, [formMessage, isError]);

  return (
    <div className="max-w-7xl mx-auto w-full space-y-4 mb-10 pt-4 px-4 sm:px-6 lg:px-20">
      <form
        onSubmit={onSubmit}
        className={`relative w-full p-[1px] rounded-full overflow-hidden bg-white/[0.03] backdrop-blur-xl border transition-all duration-350 shadow-xl ${
          isError 
            ? "border-red-500/50 shadow-red-500/10" 
            : "border-white/5"
        } ${shouldShake ? "animate-shake" : ""}`}
      >
        {/* Large Rotating Gradient Layer */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[1500%] -z-10 animate-[spin_3s_linear_infinite] pointer-events-none transition-colors duration-500 ${
            isError
              ? "bg-[conic-gradient(from_0deg,#ef4444_15%,transparent_40%)]"
              : "bg-[conic-gradient(from_0deg,#33ff00_15%,transparent_40%)]"
          }`} 
        />
        
        <div className="w-full bg-[#0e0d0e]/95 rounded-full p-1.5 pl-5 flex items-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
          <input
            type="url"
            placeholder="Enter GitHub Repository URL (e.g. https://github.com/owner/repo)..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className={`w-full bg-transparent text-sm md:text-base placeholder-[#33ff00]/40 outline-none pr-4 font-sans transition-colors duration-300 ${
              isError ? "text-red-400 placeholder-red-500/30" : "text-[#33ff00]"
            }`}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className={`font-bold px-6 py-2 rounded-full transition-all duration-300 text-xs uppercase cursor-pointer whitespace-nowrap disabled:opacity-50 ${
              isError
                ? "bg-red-500 text-white hover:bg-white hover:text-black hover:shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                : "bg-[#33ff00] text-black hover:bg-white hover:shadow-[0_0_10px_rgba(51,255,0,0.4)]"
            }`}
          >
            {submitting ? "Adding..." : "ADD"}
          </button>
        </div>
      </form>

      {formMessage && (
        <div
          className={`text-xs md:text-sm font-semibold tracking-wide py-2.5 px-5 rounded-lg border transition-all duration-300 select-text ${
            isError
              ? "text-red-400 border-red-500/25 bg-red-950/20"
              : formMessage.type === "success"
                ? "text-[#33ff00] border-[#33ff00]/25 bg-[#33ff00]/5"
                : "text-[#ffb000] border-[#ffb000]/25 bg-[#ffb000]/5"
          }`}
        >
          &gt; {formMessage.text}
        </div>
      )}
    </div>
  );
}
