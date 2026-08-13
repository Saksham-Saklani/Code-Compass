"use client";

import React from "react";
import Link from "next/link";
import { IoMdContact } from "react-icons/io";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { FaHourglassStart, FaGear } from "react-icons/fa6";
import { PiFileCodeFill } from "react-icons/pi";

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

interface RepositoryCardProps {
  repo: Repository;
  progress: number;
  onRetry?: (repoId: string) => void;
}

export default function RepositoryCard({
  repo,
  progress,
  onRetry,
}: RepositoryCardProps) {
  const isCompleted = repo.status === "COMPLETED";
  const isFailed = repo.status === "FAILED";
  const isIndexing = repo.status === "INDEXING";
  const isPending = repo.status === "PENDING";

  const fileCount = repo._count?.chunks ?? 0;

  return (
    <div className="border mt-4 border-white/5 bg-[#141414] hover:bg-[#181818] rounded-2xl p-5 flex flex-col justify-between min-h-[240px] hover:border-[#33ff00]/40 shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_28px_rgba(51,255,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-0.5">
      {/* Card Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="font-bold text-lg text-[#33ff00] uppercase tracking-wide truncate" title={repo.name}>
            {repo.name}
          </h3>
          <span
            className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${
              isCompleted
                ? "border-[#33ff00]/30 bg-[#33ff00]/5 text-[#33ff00]"
                : isIndexing || isPending
                  ? "border-[#ffb000]/30 bg-[#ffb000]/5 text-[#ffb000]"
                  : "border-red-500/30 bg-red-500/5 text-red-400"
            }`}
          >
            {isCompleted
              ? "Ready"
              : isFailed
                ? "Failed"
                : isIndexing
                  ? "Indexing"
                  : "Pending"}
          </span>
        </div>
      </div>

      {/* Card Body / Stats */}
      <div className="py-1 space-y-2.5">
        <div className="text-sm text-[#33ff00]/40 tracking-wider flex items-center gap-2">
          <IoMdContact size={16} /> owner:{" "}
          <span className="text-[#33ff00]/80 truncate">{repo.owner}</span>
        </div>
        <div>
          <div className="text-sm text-[#33ff00]/40 tracking-widest mb-0.5 flex items-center gap-2">
            <PiFileCodeFill size={16} /> Files:
            <span className="text-base font-extrabold text-[#33ff00] tracking-tight ml-1">
              {fileCount}
            </span>
          </div>
        </div>

        <div className="text-sm text-[#33ff00]/40 tracking-wider flex items-center gap-2">
          {isPending && (
            <FaHourglassStart
              size={16}
              className="text-[#ffb000] animate-pulse"
            />
          )}
          {isCompleted && (
            <IoCheckmarkCircleSharp size={16} className="text-[#33ff00]" />
          )}
          {isIndexing && (
            <FaGear size={16} className="text-[#ffb000] animate-pulse" />
          )}
          {isFailed && <RxCrossCircled size={16} className="text-red-500" />}
          <span>Status:</span>
          <span
            className={`font-semibold ${
              isCompleted
                ? "text-[#33ff00]"
                : isIndexing || isPending
                  ? "text-[#ffb000]"
                  : "text-red-500"
            }`}
          >
            {repo.status}
          </span>
        </div>
      </div>

      {/* Progress Bar or Spacer */}
      {isIndexing || isPending ? (
        <div className="space-y-1 mt-2">
          <div className="flex justify-between text-[10px] text-[#ffb000]/70 tracking-wider">
            <span>indexing codebase...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-[#1a1a1a] rounded-full h-1 overflow-hidden">
            <div
              className="bg-[#ffb000] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="h-2" />
      )}

      {/* Card Action Button */}
      {isCompleted && (
        <div className="pt-2">
          <Link
            href={`/workspace?repoId=${repo.id}`}
            className="w-full py-2 rounded-xl border border-[#33ff00]/80 text-[#33ff00] hover:bg-[#33ff00] hover:text-black hover:shadow-[0_0_10px_rgba(51,255,0,0.3)] font-bold text-xs text-center block transition-all duration-300 uppercase tracking-wider"
          >
            Chat
          </Link>
        </div>
      )}
      {isFailed && onRetry && (
        <div className="pt-2">
          <button
            onClick={() => onRetry(repo.id)}
            className="w-full py-2 rounded-xl border border-[#ffb000]/80 text-[#ffb000] hover:bg-[#ffb000] hover:text-black hover:shadow-[0_0_10px_rgba(255,176,0,0.3)] font-bold text-xs text-center block transition-all duration-300 uppercase tracking-wider"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
