"use client";

import React, { useState, useEffect } from "react";
import BackgroundAnimation from "../../src/components/BackgroundAnimation";
import {
  PiCompassRoseFill,
  PiPlusCircleBold,
  PiTerminalWindowFill,
  PiChatCenteredBold,
  PiQuestionBold,
  PiLightningFill,
} from "react-icons/pi";
import { FaArrowRight, FaChevronDown } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

/* ── Section config ─────────────────────────────── */
const NAV = [
  { id: "intro",   icon: <PiCompassRoseFill />,     label: "What is Code Compass?" },
  { id: "step-1",  icon: <PiPlusCircleBold />,      label: "Step 1 — Add a Repo" },
  { id: "step-2",  icon: <PiTerminalWindowFill />,   label: "Step 2 — Wait for Index" },
  { id: "step-3",  icon: <PiChatCenteredBold />,    label: "Step 3 — Chat with Code" },
  { id: "prompts", icon: <PiLightningFill />,        label: "Starter Prompts" },
  { id: "faq",     icon: <PiQuestionBold />,         label: "FAQ" },
];

const FAQS = [
  {
    q: "How long does indexing take?",
    a: "Indexing runs in the background automatically. Small projects are typically ready in under a minute. The status updates live on the Dashboard — no need to refresh the page.",
  },
  {
    q: "Can I switch between multiple repositories?",
    a: "Yes. Use the Current Codebase dropdown at the top of the Workspace to switch between any of your indexed repositories instantly.",
  },
  {
    q: "What kind of questions can I ask?",
    a: "Anything about your codebase — how it starts, how auth works, what routes exist, how the database is structured, what environment variables are needed, and more.",
  },
];


/* ── FAQ accordion item ─────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className="border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-[#33ff00]/25 transition-colors"
    >
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <span className="text-base font-bold text-white font-sans">{q}</span>
        <FaChevronDown
          size={14}
          className={`text-[#33ff00]/50 shrink-0 transition-transform duration-250 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="px-6 pb-5 border-t border-white/5 pt-4">
          <p className="text-base text-[#e3e3e3]/70 font-sans leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ── Browser chrome wrapper for screenshots ─────── */
function BrowserFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
      <div className="bg-[#1a1a1a] px-5 py-3 border-b border-white/8 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 text-xs text-white/30 font-mono">{label}</span>
      </div>
      {children}
    </div>
  );
}

/* ── Step header ────────────────────────────────── */
function StepHeader({
  num,
  label,
  icon,
  title,
}: {
  num: string;
  label: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <span className="text-[8rem] font-black text-white/[0.04] leading-none select-none tabular-nums">
        {num}
      </span>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ffb000]/70 font-mono">{label}</p>
        <h2 className="text-3xl font-bold text-white flex items-center gap-2.5">
          <span className="text-[#33ff00]">{icon}</span>
          {title}
        </h2>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────── */
export default function GuidePage() {
  const [active, setActive] = useState("intro");

  /* Active section tracking via scroll position */
  useEffect(() => {
    const el = document.getElementById("guide-content");
    if (!el) return;

    const onScroll = () => {
      for (let i = NAV.length - 1; i >= 0; i--) {
        const sec = document.getElementById(NAV[i].id);
        if (sec && sec.getBoundingClientRect().top <= 160) {
          setActive(NAV[i].id);
          return;
        }
      }
      setActive("intro");
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* Smooth scroll into section */
  const jump = (id: string) => {
    const sec = document.getElementById(id);
    const wrap = document.getElementById("guide-content");
    if (!sec || !wrap) return;
    const offset = sec.getBoundingClientRect().top - wrap.getBoundingClientRect().top + wrap.scrollTop - 32;
    wrap.scrollTo({ top: offset, behavior: "smooth" });
  };

  return (
    /* Full-viewport wrapper split into sidebar + content */
    <div className="flex w-full h-screen overflow-hidden bg-[#0a0a0a] text-[#33ff00] font-mono pt-[64px]">
      <BackgroundAnimation />

      {/* ═══ LEFT SIDEBAR — fixed height, independent scroll ═══ */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full overflow-y-auto border-r border-white/5 bg-black/40 backdrop-blur-md px-5 py-10 gap-1 relative z-20">
        {/* Logo line */}
        <div className="flex items-center gap-2 text-xs text-[#33ff00]/50 uppercase tracking-widest mb-6 font-bold">
          <PiCompassRoseFill className="animate-spin shrink-0" style={{ animationDuration: "8s" }} />
          User Guide
        </div>

        {/* Nav links */}
        {NAV.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => jump(id)}
            className={`flex items-center gap-3 text-left w-full px-4 py-3 rounded-xl text-sm transition-all duration-150 cursor-pointer font-sans ${
              active === id
                ? "bg-[#33ff00]/10 text-[#33ff00] font-bold"
                : "text-[#e3e3e3]/45 hover:text-[#e3e3e3] hover:bg-white/5"
            }`}
          >
            <span className={`text-base shrink-0 ${active === id ? "text-[#33ff00]" : "text-[#e3e3e3]/30"}`}>
              {icon}
            </span>
            <span className="leading-snug">{label}</span>
          </button>
        ))}

        {/* Quick links at the bottom */}
        <div className="mt-auto pt-8 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#33ff00] text-black text-sm font-bold rounded-xl uppercase hover:bg-white transition-colors"
          >
            Dashboard <FaArrowRight />
          </Link>
          <Link
            href="/workspace"
            className="flex items-center justify-center w-full py-2.5 border border-[#1f521f]/50 text-[#33ff00]/70 text-sm font-bold rounded-xl uppercase hover:border-[#33ff00]/50 hover:text-[#33ff00] transition-colors"
          >
            Workspace
          </Link>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT — independent scroll ═══ */}
      <div
        id="guide-content"
        className="flex-1 overflow-y-auto relative z-10"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 space-y-28">

          {/* ── INTRO ─────────────────────────────────────────── */}
          <section id="intro">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: headline */}
              <div className="space-y-7">
                <p className="text-xs font-bold uppercase tracking-widest text-[#33ff00]/50 font-mono">Introduction</p>
                <h1 className="text-5xl xl:text-7xl font-black text-white leading-[1.0] tracking-tight">
                  Stop<br />reading code.<br />
                  <span className="text-[#33ff00]">Ask it.</span>
                </h1>
                <p className="text-xl text-[#e3e3e3]/65 font-sans leading-relaxed">
                  Code Compass lets you chat with any GitHub repository using AI. Add a repo, wait for indexing, then ask questions in plain English — and get answers backed by your actual source code.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm font-mono">
                  {[
                    { step: "01", text: "Paste a GitHub URL", color: "text-[#ffb000]", bg: "border-[#ffb000]/20 bg-[#ffb000]/5" },
                    { step: "02", text: "Wait ~1–5 min",       color: "text-[#ffb000]", bg: "border-[#ffb000]/20 bg-[#ffb000]/5" },
                    { step: "03", text: "Chat with code",     color: "text-[#33ff00]", bg: "border-[#33ff00]/20 bg-[#33ff00]/5" },
                  ].map(({ step, text, color, bg }, i, arr) => (
                    <React.Fragment key={step}>
                      <div className={`flex items-center gap-2.5 px-4 py-3 border ${bg} rounded-xl`}>
                        <span className={`${color} opacity-50 text-xs`}>{step}</span>
                        <span className="text-white font-sans">{text}</span>
                      </div>
                      {i < arr.length - 1 && <FaArrowRight className="text-white/20 shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#33ff00] text-black font-black rounded-full text-sm uppercase tracking-wider hover:bg-white hover:shadow-[0_0_30px_rgba(51,255,0,0.3)] transition-all duration-200">
                  Get Started <FaArrowRight />
                </Link>
              </div>
              {/* Right: what you can ask */}
              <div className="border border-white/5 bg-[#111]/60 rounded-3xl p-8 space-y-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#33ff00]/40 font-mono">Example questions you can ask</p>
                <div className="space-y-3">
                  {[
                    "How does this project's authentication work?",
                    "What are all the API routes in this codebase?",
                    "Explain the database schema and table relationships.",
                    "Where does the server start and what port does it use?",
                    "What environment variables does this project require?",
                  ].map((q) => (
                    <div key={q} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <span className="text-[#33ff00]/40 shrink-0 mt-0.5">&gt;</span>
                      <span className="text-[#e3e3e3]/70 font-sans text-sm leading-relaxed">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── STEP 1 ─────────────────────────────────────────── */}
          <section id="step-1" className="space-y-8">
            <StepHeader num="1" label="Step One" icon={<PiPlusCircleBold />} title="Add a Repository" />
            {/* Two-col: instructions left, image right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              <div className="space-y-6 flex flex-col justify-center">
                <p className="text-lg text-[#e3e3e3]/70 font-sans leading-relaxed">
                  Head over to the Dashboard and paste any public GitHub repository URL. Code Compass queues it for indexing immediately.
                </p>
                <ol className="space-y-4 font-sans text-base text-[#e3e3e3]/80">
                  <li className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-[#33ff00]/10 border border-[#33ff00]/30 text-[#33ff00] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <p>Go to the <Link href="/dashboard" className="text-[#ffb000] font-bold underline hover:text-white transition-colors">Dashboard</Link>.</p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-[#33ff00]/10 border border-[#33ff00]/30 text-[#33ff00] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <p>Paste any public GitHub URL (e.g. <code className="bg-white/10 text-white px-1.5 py-0.5 rounded font-mono text-xs">https://github.com/owner/repo</code>) into the input bar at the top.</p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-[#33ff00]/10 border border-[#33ff00]/30 text-[#33ff00] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <p>Click <strong className="bg-[#33ff00] text-black px-2.5 py-0.5 rounded-full text-xs">ADD</strong>. A new repository card appears instantly.</p>
                  </li>
                </ol>
                <div className="bg-[#111]/70 border border-white/5 rounded-2xl p-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#33ff00]/50 font-mono">What happens next</p>
                  <p className="font-sans text-base text-[#e3e3e3]/65 leading-relaxed">
                    The card shows status <strong className="text-[#ffb000] font-mono">PENDING</strong>. Background processing starts automatically — you don't need to do anything else.
                  </p>
                </div>
              </div>
              <BrowserFrame label="code-compass · Dashboard">
                <Image src="/guide_add_repo.png" alt="Pasting a GitHub URL into Code Compass" width={1200} height={700} className="w-full h-full object-cover" />
              </BrowserFrame>
            </div>
          </section>

          {/* ── STEP 2 ─────────────────────────────────────────── */}
          <section id="step-2" className="space-y-8">
            <StepHeader num="2" label="Step Two" icon={<PiTerminalWindowFill />} title="Wait for Indexing" />
            {/* Two-col: image left, text right (alternating) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              <BrowserFrame label="code-compass · Repository Card">
                <Image src="/guide_indexing_status.png" alt="Repository card showing Pending → Indexing → Ready states" width={1200} height={700} className="w-full h-full object-cover" />
              </BrowserFrame>
              <div className="space-y-6 flex flex-col justify-center">
                <p className="text-lg text-[#e3e3e3]/70 font-sans leading-relaxed">
                  After you add a repo, Code Compass processes it in the background. You don't need to stay on the page — the status updates automatically.
                </p>
                {/* Status pipeline */}
                <div className="space-y-3">
                  {[
                    { label: "Pending",  desc: "Job is queued, waiting to start",       dot: "bg-[#ffb000] animate-pulse", border: "border-[#ffb000]/20 bg-[#ffb000]/5", color: "text-[#ffb000]" },
                    { label: "Indexing", desc: "Files are being embedded and stored",   dot: "bg-[#ffb000] animate-ping",  border: "border-[#ffb000]/20 bg-[#ffb000]/5", color: "text-[#ffb000]" },
                    { label: "Ready",    desc: "Indexing complete — chat is unlocked",  dot: "bg-[#33ff00]",               border: "border-[#33ff00]/20 bg-[#33ff00]/5", color: "text-[#33ff00]" },
                  ].map(({ label, desc, dot, border, color }) => (
                    <div key={label} className={`flex items-center gap-5 border ${border} rounded-2xl px-5 py-4`}>
                      <span className={`w-3 h-3 rounded-full ${dot} shrink-0`} />
                      <div>
                        <div className={`font-bold text-sm uppercase font-mono ${color}`}>{label}</div>
                        <div className="text-[#e3e3e3]/55 text-sm font-sans mt-0.5">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-base text-[#e3e3e3]/55 font-sans leading-relaxed border-l-2 border-[#33ff00]/25 pl-4">
                  Small repos: ~<strong className="text-white">1 min</strong>. Large monorepos: ~<strong className="text-white">5–10 min</strong>. The page updates live.
                </p>
              </div>
            </div>
          </section>

          {/* ── STEP 3 ─────────────────────────────────────────── */}
          <section id="step-3" className="space-y-8">
            <StepHeader num="3" label="Step Three" icon={<PiChatCenteredBold />} title="Chat with Your Code" />
            {/* Two-col: instructions left, image right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              <div className="space-y-6 flex flex-col justify-center">
                <p className="text-lg text-[#e3e3e3]/70 font-sans leading-relaxed">
                  Once a repo is <strong className="text-[#33ff00] font-mono">READY</strong>, click <strong className="text-white border border-[#33ff00] px-2 py-0.5 rounded text-sm">CHAT</strong> on its card — or open the <Link href="/workspace" className="text-[#ffb000] underline font-bold hover:text-white">Workspace</Link> and select from the dropdown. Then just type your question.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { t: "Referenced Files", b: "Under every answer, see exactly which source files the AI used — with a match percentage showing how relevant each one is." },
                    { t: "Switch Repos", b: "Use the Current Codebase dropdown at the top of the Workspace to jump between any of your indexed repositories." },
                  ].map(({ t, b }) => (
                    <div key={t} className="border border-white/5 bg-[#111]/50 rounded-2xl p-4 space-y-1.5 hover:border-[#33ff00]/20 transition-colors">
                      <h3 className="text-xs font-bold text-[#33ff00] uppercase tracking-wider font-mono">{t}</h3>
                      <p className="text-sm text-[#e3e3e3]/65 font-sans leading-relaxed">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
              <BrowserFrame label="code-compass · Workspace">
                <Image src="/guide_chat_interface.png" alt="AI chat response with referenced source files" width={1200} height={700} className="w-full h-full object-cover" />
              </BrowserFrame>
            </div>
          </section>

          {/* ── PROMPTS ─────────────────────────────────────────── */}
          <section id="prompts" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#33ff00]/50 font-mono mb-2">Inspiration</p>
                <h2 className="text-3xl font-bold text-white">Starter Prompts</h2>
              </div>
              <p className="text-base text-[#e3e3e3]/50 font-sans max-w-sm">
                Not sure what to ask? Copy any of these into the chat to get started.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Where does the server start and what port does it listen on?",
                "Explain the database schema and relationships between tables.",
                "List all API routes and their corresponding handlers.",
                "How does user authentication and session management work?",
                "What environment variables does this project need to run?",
                "Are there any background jobs, workers, or cron tasks?",
              ].map((p) => (
                <div key={p} className="group p-5 border border-white/5 bg-[#111]/40 rounded-2xl hover:border-[#33ff00]/25 hover:bg-[#33ff00]/[0.03] transition-all cursor-pointer">
                  <p className="text-sm text-[#e3e3e3]/60 font-sans group-hover:text-[#e3e3e3] transition-colors leading-relaxed">
                    &quot;{p}&quot;
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ─────────────────────────────────────────────── */}
          <section id="faq" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#33ff00]/50 font-mono mb-2">Help</p>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <PiQuestionBold className="text-[#33ff00]" /> FAQ
                </h2>
              </div>
              <p className="text-base text-[#e3e3e3]/50 font-sans max-w-sm">Common questions about Code Compass.</p>
            </div>
            <div className="flex flex-col gap-3">
              {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────────────────── */}
          <section className="text-center space-y-5 border border-[#33ff00]/15 bg-gradient-to-b from-[#33ff00]/5 to-transparent rounded-3xl p-12">
            <div className="text-5xl">🚀</div>
            <h3 className="text-3xl font-black text-white">Ready to dig in?</h3>
            <p className="text-lg text-[#e3e3e3]/55 font-sans max-w-sm mx-auto leading-relaxed">
              Add your first repository and start asking questions in minutes.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-9 py-4 bg-[#33ff00] text-black font-black rounded-full text-base uppercase tracking-wider hover:bg-white hover:shadow-[0_0_40px_rgba(51,255,0,0.3)] transition-all duration-200"
            >
              Go to Dashboard <FaArrowRight />
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
