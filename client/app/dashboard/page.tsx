"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import BackgroundAnimation from "../../src/components/BackgroundAnimation";
import AddRepoBar from "../../src/components/AddRepoBar";
import RepositoryCard from "../../src/components/RepositoryCard";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function DashboardPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form input state
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formMessage, setFormMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Simulated progress tracking for repos currently indexing
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  // Fetch repositories from DB
  const fetchRepositories = async () => {
    try {
      const { data } = await axios.get<Repository[]>(`${API_BASE}/api/repository`);
      setRepositories(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch repositories:", err);
      setError(err.response?.data?.message || err.message || "Failed to connect to backend database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  // Poll for updates if any repository is PENDING or INDEXING
  useEffect(() => {
    const hasActiveIndexing = repositories.some(
      (r) => r.status === "PENDING" || r.status === "INDEXING",
    );

    if (!hasActiveIndexing) return;

    const interval = setInterval(() => {
      fetchRepositories();
    }, 3000);

    return () => clearInterval(interval);
  }, [repositories]);

  // Smooth progress calculation for active indexing items
  useEffect(() => {
    const activeRepos = repositories.filter(
      (r) => r.status === "PENDING" || r.status === "INDEXING",
    );

    if (activeRepos.length === 0) return;

    const progressInterval = setInterval(() => {
      setProgressMap((prev) => {
        const next = { ...prev };
        activeRepos.forEach((repo) => {
          const current = next[repo.id] || 15;
          if (current < 90) {
            next[repo.id] = current + Math.floor(Math.random() * 8) + 2;
          }
        });
        return next;
      });
    }, 800);

    return () => clearInterval(progressInterval);
  }, [repositories]);

  // Handle adding repository
  const handleAddRepository = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setSubmitting(true);
    setFormMessage({ text: "Adding repository to database...", type: "info" });

    try {
      // 1. Create Repository
      const createRes = await axios.post(`${API_BASE}/api/repository`, {
        url: repoUrl.trim(),
      });

      const newRepo: Repository = createRes.data.repository;

      // 2. Trigger Indexing Job
      try {
        await axios.post(`${API_BASE}/api/repository/index/${newRepo.id}`);
      } catch (indexErr: any) {
        console.warn(
          "Indexing trigger note:",
          indexErr.response?.data?.message || indexErr.message,
        );
      }

      setFormMessage({
        text: `Successfully added ${newRepo.owner}/${newRepo.name}`,
        type: "success",
      });
      setRepoUrl("");

      // Initialize progress state
      setProgressMap((prev) => ({ ...prev, [newRepo.id]: 20 }));

      // Refresh list from database
      await fetchRepositories();
    } catch (err: any) {
      console.error("Add repository error:", err);
      setFormMessage({
        text: err.response?.data?.message || err.message || "Failed to add repository",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex-1 text-[#33ff00] font-mono p-6 md:p-12 mx-auto w-full space-y-12 select-none">
      {/* Background Animation & Grid */}
      <BackgroundAnimation />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mx-20">
        <div>
          <h1 className="text-3xl font-bold tracking-wide uppercase">
            &gt; Add Repository
          </h1>
        </div>
      </div>

      {/* Add Repository URL Input Bar Component */}
      <AddRepoBar
        repoUrl={repoUrl}
        setRepoUrl={setRepoUrl}
        submitting={submitting}
        formMessage={formMessage}
        onSubmit={handleAddRepository}
      />

      {/* Error Banner */}
      {error && (
        <div className="max-w-3xl mx-auto border border-red-900 bg-red-950/20 text-red-400 rounded-xl p-4 text-xs">
          &gt; Connection error: {error}. Check if backend is running on {API_BASE}.
        </div>
      )}

      {/* Repositories Grid (2x3 Card Format) */}
      <div className="space-y-8 max-w-8xl mx-20">
        <div className="flex items-center justify-between font-bold text-3xl text-[#33ff00] border-b border-[#1f521f]/40 pb-3">
          <span className="uppercase">&gt; Repositories</span>
        </div>

        {loading ? (
          <div className="py-24 text-center text-sm text-[#33ff00]/40">
            [ Loading repositories from database... ]
          </div>
        ) : repositories.length === 0 ? (
          <div className="py-24 text-center text-sm text-[#33ff00]/40 space-y-3 border border-[#1f521f]/20 rounded-3xl bg-[#0c0c0c]/40">
            <div>&gt; No repositories found in database.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {repositories.map((repo) => {
              const isCompleted = repo.status === "COMPLETED";
              const isFailed = repo.status === "FAILED";
              const progress = isCompleted ? 100 : progressMap[repo.id] || (isFailed ? 0 : 45);

              return (
                <RepositoryCard
                  key={repo.id}
                  repo={repo}
                  progress={progress}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
