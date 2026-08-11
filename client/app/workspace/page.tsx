"use client";

import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  useCallback,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PiCompassRoseFill } from "react-icons/pi";
import axios from "axios";

// Component-Driven imports
import { WorkspaceHeader } from "./components/WorkspaceHeader";
import { WorkspaceInput } from "./components/WorkspaceInput";
import { MessageItem } from "./components/MessageItem";

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

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  sources?: { path: string; score: number }[];
  timestamp: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoIdParam = searchParams.get("repoId");

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch repositories
  const fetchRepositories = async (selectIdAfterFetch?: string) => {
    try {
      const { data } = await axios.get<Repository[]>(
        `${API_BASE}/api/repository`,
      );
      setRepositories(data);
      setError(null);

      const completedRepos = data.filter((r) => r.status === "COMPLETED");
      if (completedRepos.length > 0) {
        let targetId =
          selectIdAfterFetch || selectedRepoId || completedRepos[0].id;

        if (repoIdParam && completedRepos.some((r) => r.id === repoIdParam)) {
          targetId = repoIdParam;
        } else if (!completedRepos.some((r) => r.id === targetId)) {
          targetId = completedRepos[0].id;
        }

        setSelectedRepoId(targetId);
        const repoObj =
          completedRepos.find((r) => r.id === targetId) || completedRepos[0];
        setSelectedRepo(repoObj);
      } else {
        setSelectedRepoId("");
        setSelectedRepo(null);
      }
    } catch (err: any) {
      console.error("Failed to fetch repositories:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to establish connection to database server.",
      );
    } finally {
      setLoadingRepos(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, [repoIdParam]);

  // Handles target repository switching (memoized)
  const handleRepoChange = useCallback(
    (id: string) => {
      setSelectedRepoId(id);
      const repoObj = repositories.find((r) => r.id === id) || null;
      setSelectedRepo(repoObj);

      if (id) {
        router.push(`/workspace?repoId=${id}`, { scroll: false });
      } else {
        router.push("/workspace", { scroll: false });
      }

      setMessages([]);
      setChatError(null);
    },
    [repositories, router],
  );

  // Poll repository status if indexing
  useEffect(() => {
    if (!selectedRepo) return;

    const needsPolling =
      selectedRepo.status === "PENDING" || selectedRepo.status === "INDEXING";
    if (!needsPolling) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get<Repository>(
          `${API_BASE}/api/repository/${selectedRepo.id}`,
        );

        setRepositories((prev) =>
          prev.map((r) =>
            r.id === data.id
              ? { ...r, status: data.status, _count: data._count }
              : r,
          ),
        );

        if (data.id === selectedRepoId) {
          setSelectedRepo(data);
        }
      } catch (err) {
        console.error("Error polling repo status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedRepo, selectedRepoId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Handles query submissions (memoized)
  const handleSubmitQuery = useCallback(
    async (e?: React.FormEvent, customQuery?: string) => {
      if (e) e.preventDefault();

      const query = customQuery || inputQuery;
      if (
        !query.trim() ||
        !selectedRepo ||
        selectedRepo.status !== "COMPLETED" ||
        sending
      )
        return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        text: query.trim(),
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputQuery("");
      setSending(true);
      setChatError(null);
      setLoadingStep(0);

      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < 2) return prev + 1;
          clearInterval(stepInterval);
          return prev;
        });
      }, 2000);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await axios.post(
          `${API_BASE}/api/chat/repository/${selectedRepo.id}`,
          { query: query.trim() },
          { signal: controller.signal },
        );

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: response.data.answer,
          sources: response.data.sources,
          timestamp: getTimestamp(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-cancelled-${Date.now()}`,
              role: "system",
              text: "ANALYSIS SHUT DOWN. GENERATION CANCELLED BY USER.",
              timestamp: getTimestamp(),
            },
          ]);
          return;
        }
        console.error("Failed to query assistant:", err);
        setChatError(
          err.response?.data?.error ||
            err.message ||
            "Network timeout. Unable to fetch response from backend AI.",
        );
      } finally {
        clearInterval(stepInterval);
        setSending(false);
        abortControllerRef.current = null;
      }
    },
    [inputQuery, selectedRepo, sending],
  );

  const handleClearHistory = useCallback(() => {
    setMessages([]);
    setChatError(null);
  }, []);

  const handleStopRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setSending(false);
  }, []);

  return (
    <div className="flex-1 flex h-screen bg-[#131314] overflow-hidden text-[#e3e3e3] font-sans relative pt-24">
      {/* Dynamic CSS override block to completely disable the CRT green lines overlay */}
      <style>{`
        .crt-overlay { display: none !important; }
        body { 
          text-shadow: none !important;
          background-color: #131314 !important;
          color: #e3e3e3 !important;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }
      `}</style>

      {/* MAIN SCREEN AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#131314] relative z-10">
        {/* SOFT GREEN RADIAL GLOW IN CENTER */}
        {messages.length === 0 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
            <div className="w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(51,255,0,0.18)_0%,rgba(51,255,0,0.05)_55%,transparent_75%)] rounded-full blur-[90px] animate-[pulse_12s_ease-in-out_infinite]" />
          </div>
        )}

        {/* TOP COMPONENT: Minimal Dropdown Select */}
        <WorkspaceHeader
          repositories={repositories}
          selectedRepoId={selectedRepoId}
          selectedRepo={selectedRepo}
          onRepoChange={handleRepoChange}
          showClearChat={messages.length > 0}
          onClearChat={handleClearHistory}
        />

        {/* CHAT CONTAINER */}
        <div className="flex-1 overflow-hidden flex flex-col justify-between relative">
          {/* VIEW 1: EMPTY STATE - Header & Input Form centered together */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center px-6 w-full max-w-5xl mx-auto space-y-6 select-none relative z-10">
              <h2 className="text-2xl md:text-[30px] font-normal tracking-tight text-[#e3e3e3] select-none font-sans leading-tight text-center">
                What should we focus on?
              </h2>

              {/* Centered Input Form */}
              <div className="w-full">
                <WorkspaceInput
                  inputQuery={inputQuery}
                  setInputQuery={setInputQuery}
                  sending={sending}
                  selectedRepo={selectedRepo}
                  onSubmit={handleSubmitQuery}
                  onStop={handleStopRequest}
                />
              </div>

              {selectedRepo ? (
                <p className="text-[10px] text-[#33ff00]/60 tracking-widest font-bold uppercase font-mono text-center">
                  linked: {selectedRepo.owner}/{selectedRepo.name}
                </p>
              ) : (
                <p className="text-[10px] text-red-500/50 uppercase tracking-widest font-mono text-center">
                  Offline: Select a codebase from dropdown
                </p>
              )}
            </div>
          ) : (
            /* VIEW 2: ACTIVE CHAT HISTORY */
            <>
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 max-w-5xl mx-auto w-full scrollbar-thin scrollbar-thumb-[#1f521f]/30">
                {messages.map((msg) => (
                  <MessageItem key={msg.id} msg={msg} />
                ))}

                {/* Cognitive search loader */}
                {sending && (
                  <div className="flex justify-start items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1e1f20]/50 border border-[#1f521f]/20 text-[#33ff00] flex-shrink-0 select-none">
                      <PiCompassRoseFill
                        className="w-5 h-5 text-[#33ff00] animate-spin"
                        style={{ animationDuration: "3s" }}
                      />
                    </div>
                    <div className="text-sm text-[#33ff00]/85 select-none flex items-center gap-2.5 py-1 font-mono">
                      {loadingStep === 0 && (
                        <span>Searching repository...</span>
                      )}
                      {loadingStep === 1 && (
                        <span>Retrieving relevant files...</span>
                      )}
                      {loadingStep === 2 && (
                        <span>
                          Generating response...{" "}
                          <span className="animate-blink font-bold">_</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Query errors */}
                {chatError && (
                  <div className="border border-red-900/60 bg-red-950/20 px-4 py-3 rounded-lg text-xs text-red-400 font-mono">
                    ⚠ Error scanning query: {chatError}
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* LOWER SECTION: Spaced Input pill for Active Chat */}
              <div className="w-full max-w-5xl mx-auto px-6 pb-6 relative z-10 bg-[#131314] pt-4">
                {/* Indexing alert message */}
                {selectedRepo && selectedRepo.status !== "COMPLETED" && (
                  <div className="border border-yellow-900/40 bg-yellow-950/15 p-3.5 rounded-2xl text-center space-y-1 mb-4 select-none font-mono">
                    <div className="text-xs font-bold text-yellow-500 uppercase tracking-wider animate-pulse">
                      ⚠ Codebase indexing under process ({selectedRepo.status})
                    </div>
                    <div className="text-[10px] text-[#33ff00]/60">
                      Chat input is temporarily offline. It will unlock
                      automatically once completed.
                    </div>
                  </div>
                )}

                <WorkspaceInput
                  inputQuery={inputQuery}
                  setInputQuery={setInputQuery}
                  sending={sending}
                  selectedRepo={selectedRepo}
                  onSubmit={handleSubmitQuery}
                  onStop={handleStopRequest}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* DB link offline overlay */}
      {error && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full border border-red-950 bg-[#0d0707] rounded-2xl p-6 text-center space-y-4 font-mono shadow-2xl">
            <div className="w-10 h-10 bg-red-950/40 text-red-500 border border-red-900/60 rounded-full flex items-center justify-center mx-auto text-lg font-bold animate-pulse">
              !
            </div>
            <h3 className="text-red-500 font-bold uppercase text-sm tracking-wider">
              System link offline
            </h3>
            <p className="text-xs text-[#33ff00]/70 select-text">
              Failed to connect to the database. Error detail: <br />
              <span className="text-red-400 bg-red-950/20 px-2 py-1 rounded inline-block mt-2 font-semibold">
                {error}
              </span>
            </p>
            <button
              type="button"
              onClick={() => fetchRepositories()}
              className="w-full py-2 bg-red-950/40 text-red-400 hover:bg-red-500 hover:text-black border border-red-900 rounded-lg text-xs font-bold uppercase transition-all duration-150 active:translate-y-0.5 cursor-pointer"
            >
              Retry Database Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#131314] text-[#33ff00] font-mono flex flex-col items-center justify-center gap-3">
          <div className="text-xs tracking-widest uppercase animate-pulse">
            [ Loading workspace environment... ]
          </div>
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
