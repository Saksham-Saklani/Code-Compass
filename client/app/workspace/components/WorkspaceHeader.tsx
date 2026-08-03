import React, { memo } from "react";
import { BiGitBranch } from "react-icons/bi";

interface Repository {
  id: string;
  url: string;
  owner: string;
  name: string;
  defaultBranch: string;
  status: "PENDING" | "INDEXING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  _count?: {
    chunks: number;
  };
}

interface WorkspaceHeaderProps {
  repositories: Repository[];
  selectedRepoId: string;
  selectedRepo: Repository | null;
  onRepoChange: (id: string) => void;
  showClearChat: boolean;
  onClearChat: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = memo(({
  repositories,
  selectedRepoId,
  selectedRepo,
  onRepoChange,
  showClearChat,
  onClearChat,
}) => {
  const completedRepos = repositories.filter((r) => r.status === "COMPLETED");

  return (
    <div className="w-full h-14 flex items-center px-6 justify-between select-none bg-[#131314] relative z-20">
      <div className="flex items-center gap-3">
        <span className="text-[20px] uppercase tracking-widest text-[#33ff00]/60 font-bold font-mono">
          CURRENT CODEBASE:
        </span>
        <div className="relative">
          <select
            value={selectedRepoId}
            onChange={(e) => onRepoChange(e.target.value)}
            className="bg-transparent text-[#33ff00] hover:text-[#33ff00] font-semibold text-sm py-1.5 pl-2.5 pr-8 border border-[#1f521f]/35 hover:border-[#33ff00]/60 rounded-lg outline-none cursor-pointer appearance-none select-none transition-all duration-200 font-mono"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2333ff00' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 6px center",
              backgroundSize: "20px"
            }}
          >
            {completedRepos.length === 0 ? (
              <option className="bg-[#131314] text-[#33ff00]">No completed codebases</option>
            ) : (
              completedRepos.map((repo) => (
                <option key={repo.id} value={repo.id} className="bg-[#131314] text-[#33ff00]">
                  {repo.name}
                </option>
              ))
            )}
          </select>
        </div>
        
      
      </div>

      {/* Right aligned: Clear Chat & Status */}
      <div className="flex items-center gap-4">
        {showClearChat && (
          <button
            type="button"
            onClick={onClearChat}
            className="text-[11px] text-[#c4c7c5]/60 hover:text-red-400 border border-[#1f521f]/30 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            Clear Chat
          </button>
        )}
        <div className="flex items-center gap-2 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#33ff00] animate-pulse shadow-[0_0_4px_#33ff00]" />
          <span className="text-[10px] text-[#33ff00]/60 uppercase tracking-widest font-bold font-mono">READY</span>
        </div>
      </div>
    </div>
  );
});

WorkspaceHeader.displayName = "WorkspaceHeader";
