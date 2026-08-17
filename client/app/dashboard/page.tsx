"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import BackgroundAnimation from "../../src/components/BackgroundAnimation";
import AddRepoBar from "./components/AddRepoBar";
import RepositoryCard from "./components/RepositoryCard";

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
      const { data } = await axios.get<Repository[]>(
        `${API_BASE}/api/repository`,
      );
      setRepositories(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch repositories:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to connect to backend database",
      );
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
    const trimmedUrl = repoUrl.trim();
    if (!trimmedUrl) return;

    // Client-side URL validation matching backend requirements
    try {
      const parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.hostname !== "github.com" && parsedUrl.hostname !== "www.github.com") {
        setFormMessage({
          text: "Only GitHub repositories are currently supported.",
          type: "error",
        });
        return;
      }
      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      if (pathParts.length !== 2) {
        setFormMessage({
          text: "Invalid GitHub URL format. Expected: https://github.com/{owner}/{repo}",
          type: "error",
        });
        return;
      }
    } catch (err) {
      setFormMessage({
        text: "Please enter a valid URL (e.g. https://github.com/owner/repo).",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    setFormMessage({ text: "Adding repository to database...", type: "info" });

    try {
      // 1. Create Repository
      const createRes = await axios.post(`${API_BASE}/api/repository`, {
        url: trimmedUrl,
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
      
      // Safely extract string message to prevent React rendering crashes with objects
      let displayError = "Failed to add repository";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data.message === "string") {
          displayError = data.message;
        } else if (typeof data.error === "string") {
          displayError = data.error;
        } else if (typeof data === "string") {
          displayError = data;
        }
      } else if (err.message) {
        displayError = err.message;
      }

      setFormMessage({
        text: displayError,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryRepository = async (repoId: string) => {
    try {
      await axios.post(`${API_BASE}/api/repository/index/${repoId}`);
      setProgressMap((prev) => ({ ...prev, [repoId]: 20 }));
      await fetchRepositories();
    } catch (err: any) {
      console.error("Retry repository error:", err);
      setFormMessage({
        text: err.response?.data?.message || "Failed to retry indexing",
        type: "error",
      });
    }
  };

  const handleDeleteRepository = async (repoId: string) => {
    if (!window.confirm("Are you sure you want to delete this repository?")) return;
    try {
      await axios.delete(`${API_BASE}/api/repository/${repoId}`);
      setRepositories((prev) => prev.filter((r) => r.id !== repoId));
      setFormMessage({
        text: "Repository deleted successfully.",
        type: "success",
      });
    } catch (err: any) {
      console.error("Delete repository error:", err);
      setFormMessage({
        text: err.response?.data?.message || "Failed to delete repository",
        type: "error",
      });
    }
  };

  return (
    <div className="relative flex-1 text-[#33ff00] font-mono pt-28 pb-12 px-6 md:px-12 mx-auto w-full space-y-12 select-none">
      {/* Background Animation & Grid */}
      <BackgroundAnimation />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mx-20">
        <div>
          <h1 className="text-xl font-bold tracking-wide uppercase">
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
        <div className="max-w-3xl mx-auto border border-red-900 bg-red-950/20 text-red-400 rounded-xl p-3 text-xs">
          &gt; Connection error: {error}. Check if backend is running on{" "}
          {API_BASE}.
        </div>
      )}

      {/* Repositories Grid (2x3 Card Format) */}
      <div className="space-y-4 max-w-8xl mx-20">
        <div className="flex items-center justify-between font-bold text-xl text-[#33ff00] border-b border-[#1f521f]/40 pb-2">
          <span className="uppercase">&gt; Repositories</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#33ff00]/40">
            [ Loading repositories from database... ]
          </div>
        ) : repositories.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#33ff00]/40 space-y-2 border border-[#1f521f]/20 rounded-2xl bg-[#0c0c0c]/40">
            <div>&gt; No repositories found in database.</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {repositories.map((repo) => {
              const isCompleted = repo.status === "COMPLETED";
              const isFailed = repo.status === "FAILED";
              const progress = isCompleted
                ? 100
                : progressMap[repo.id] || (isFailed ? 0 : 45);

              return (
                <RepositoryCard
                  key={repo.id}
                  repo={repo}
                  progress={progress}
                  onRetry={handleRetryRepository}
                  onDelete={handleDeleteRepository}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
