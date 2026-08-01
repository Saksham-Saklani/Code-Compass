"use client";

import React from "react";

export default function BackgroundAnimation() {
  return (
    <>
      {/* Self-contained Grid Animation stylesheet */}
      <style>{`
        @keyframes grid-drift {
          0% { background-position: 0px 0px; }
          100% { background-position: 60px 60px; }
        }
        .grid-drift-animated {
          animation: grid-drift 25s linear infinite;
        }
      `}</style>

      {/* Subtle Background Grid & Glow Animation */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none -z-10 grid-drift-animated"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(51, 255, 0, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(51, 255, 0, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      >
        <div className="absolute top-[10%] left-[-20%] w-[140%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(51,255,0,0.05)_0%,transparent_65%)] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] left-[10%] w-[250px] h-[250px] bg-[#33ff00]/[0.02] blur-[80px] rounded-full animate-[pulse_18s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#33ff00]/[0.02] blur-[120px] rounded-full animate-[pulse_14s_ease-in-out_infinite_4s]" />
      </div>
    </>
  );
}
