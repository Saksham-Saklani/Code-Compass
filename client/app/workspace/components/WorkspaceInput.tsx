import React, { memo } from "react";
import { BiSend } from "react-icons/bi";

interface WorkspaceInputProps {
  inputQuery: string;
  setInputQuery: (query: string) => void;
  sending: boolean;
  selectedRepo: { status: string } | null;
  onSubmit: (e: React.FormEvent) => void;
  onStop: () => void;
}

export const WorkspaceInput: React.FC<WorkspaceInputProps> = memo(({
  inputQuery,
  setInputQuery,
  sending,
  selectedRepo,
  onSubmit,
  onStop,
}) => {
  const isCompleted = selectedRepo?.status === "COMPLETED";

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full flex items-center rounded-full bg-[#1e1f20] hover:bg-[#202124] focus-within:bg-[#202124] focus-within:shadow-[0_0_12px_rgba(51,255,0,0.06)] px-6 py-6 transition-all duration-300"
    >
      {/* Middle: Input field */}
      <input
        type="text"
        value={inputQuery}
        onChange={(e) => setInputQuery(e.target.value)}
        disabled={!isCompleted || sending}
        placeholder={
          !selectedRepo
            ? "Add a repo to begin..."
            : !isCompleted
              ? ` Indexing: ${selectedRepo.status}...`
              : "Ask anything about this repository..."
        }
        className="flex-1 bg-transparent text-[#e3e3e3] placeholder-[#c4c7c5]/50 outline-none text-[20px] font-sans font-normal disabled:cursor-not-allowed pr-4"
      />

      {/* Right Side: Send Trigger / Stop Button */}
      {sending ? (
        <button
          type="button"
          onClick={onStop}
          className="text-red-500 hover:text-red-400 cursor-pointer flex items-center justify-center transition-colors duration-150"
          title="Stop generating"
        >
          <span className="w-6 h-6 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/25">
            <span className="w-2 h-2 bg-red-500 rounded-sm animate-pulse" />
          </span>
        </button>
      ) : (
        <button
          type="submit"
          disabled={!isCompleted || !inputQuery.trim()}
          className="text-[#c4c7c5] hover:text-[#33ff00] disabled:opacity-35 cursor-pointer transition-colors duration-150 flex items-center justify-center"
        >
          <BiSend size={20} />
        </button>
      )}
    </form>
  );
});

WorkspaceInput.displayName = "WorkspaceInput";
