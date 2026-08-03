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
}

export default function RepositoryCard({ repo, progress }: RepositoryCardProps) {
  const isCompleted = repo.status === "COMPLETED";
  const isFailed = repo.status === "FAILED";
  const isIndexing = repo.status === "INDEXING";
  const isPending = repo.status === "PENDING";

  const fileCount = repo._count?.chunks ?? 0;

  return (
    <div
      className="border mt-10 border-white/5 bg-[#141414] hover:bg-[#181818] rounded-3xl p-8 flex flex-col justify-between min-h-[400px] hover:border-[#33ff00]/40 shadow-[0_16px_36px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_16px_40px_rgba(51,255,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Card Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-2xl text-[#33ff00] uppercase tracking-wide truncate">
            {repo.name}
          </h3>
          <span
            className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
              isCompleted
                ? "border-[#33ff00]/30 bg-[#33ff00]/5 text-[#33ff00]"
                : isIndexing || isPending
                  ? "border-[#ffb000]/30 bg-[#ffb000]/5 text-[#ffb000]"
                  : "border-red-500/30 bg-red-500/5 text-red-400"
            }`}
          >
            {isCompleted ? "Ready" : isFailed ? "Failed" : isIndexing ? "Indexing" : "Pending"}
          </span>
        </div>
      </div>

      {/* Card Body / Stats */}
      <div className="py-2 space-y-4">
        <div className="text-lg text-[#33ff00]/40 tracking-wider flex items-center gap-2">
          <IoMdContact size={18} /> owner:{" "}
          <span className="text-[#33ff00]/80 truncate">{repo.owner}</span>
        </div>
        <div>
          <div className="text-md text-[#33ff00]/40 tracking-widest mb-1 flex items-center gap-2">
            <PiFileCodeFill size={18} /> Files: 
            <span className="text-xl font-extrabold text-[#33ff00] tracking-tight ml-1">
              {fileCount}
            </span>
          </div>
        </div>

        <div className="text-md text-[#33ff00]/40 tracking-wider flex items-center gap-2">
          {isPending && <FaHourglassStart size={18} className="text-[#ffb000] animate-pulse" />}
          {isCompleted && <IoCheckmarkCircleSharp size={18} className="text-[#33ff00]" />}
          {isIndexing && <FaGear size={18} className="text-[#ffb000] animate-pulse" />}
          {isFailed && <RxCrossCircled size={18} className="text-red-500" />}
          <span>Status:</span>
          <span className={`font-semibold ${
            isCompleted ? "text-[#33ff00]" : isIndexing || isPending ? "text-[#ffb000]" : "text-red-500"
          }`}>
            {repo.status}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {(isIndexing || isPending) ? (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#ffb000]/70 tracking-wider">
            <span>indexing codebase...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#ffb000] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="h-7" />
      )}

      {/* Card Action Button */}
      {isCompleted && (
        <div className="pt-2">
          <Link
            href={`/workspace?repoId=${repo.id}`}
            className="w-full py-3.5 rounded-2xl border border-[#33ff00]/80 text-[#33ff00] hover:bg-[#33ff00] hover:text-black hover:shadow-[0_0_15px_rgba(51,255,0,0.3)] font-bold text-sm text-center block transition-all duration-300 uppercase tracking-wider"
          >
            Chat
          </Link>
        </div>
      )}
    </div>
  );
}
