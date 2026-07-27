"use client";

import React from "react";

export default function Hero() {
  const [line1, setLine1] = React.useState("");
  const [line2, setLine2] = React.useState("");

  React.useEffect(() => {
    const fullLine1 = "ASK YOUR";
    const fullLine2 = "CODEBASE";
    let index1 = 0;
    let index2 = 0;

    const timer1 = setInterval(() => {
      if (index1 < fullLine1.length) {
        setLine1(fullLine1.slice(0, index1 + 1));
        index1++;
      } else {
        clearInterval(timer1);
        const timer2 = setInterval(() => {
          if (index2 < fullLine2.length) {
            setLine2(fullLine2.slice(0, index2 + 1));
            index2++;
          } else {
            clearInterval(timer2);
          }
        }, 50);
      }
    }, 50);

    return () => {
      clearInterval(timer1);
    };
  }, []);

  return (
    <section className="w-full bg-[#0a0a0a] text-[#33ff00] font-mono py-24 px-30 flex flex-col justify-center select-none">
      <div className="max-w-7xl space-y-8">
        
        

        {/* Main Headline */}
        <h1 className="text-7xl md:text-6xl lg:text-8xl font-semibold tracking-wide leading-tight uppercase glow-text min-h-[2.2em] md:min-h-[2.2em]">
          {line1}
          {line1.length < 8 && (
            <span className="inline-block w-4 h-12 md:w-6 md:h-16 bg-[#33ff00] animate-blink ml-2 align-middle"></span>
          )}
          {line1.length === 8 && <br />}
          {line2}
          {line1.length === 8 && line2.length < 8 && (
            <span className="inline-block w-4 h-12 md:w-6 md:h-16 bg-[#33ff00] animate-blink ml-2 align-middle"></span>
          )}
        </h1>

        {/* Description Pane (with vertical indicator line) */}
        <div className="border-l-2 border-[#33ff00] pl-6 max-w-2xl py-1">
          <p className="text-lg sm:text-xl md:text-2xl text-[#33ff00]/85 leading-relaxed tracking-wide">
            Stop searching through hundreds of files.
            Ask questions and get AI-powered
            answers backed by your source code.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center gap-6 pt-4">
          {/* Solid Neon Button */}
          <button className="px-12 py-4 bg-[#33ff00] text-black font-bold text-xl  hover:bg-transparent hover:text-[#33ff00] border border-[#33ff00] transition-all duration-150 active:translate-y-0.5">
            Get Started
          </button>

          {/* Dashed Button */}
          <button className="px-8 py-4 border border-dashed border-[#33ff00] text-xl font-bold hover:bg-neutral-800 transition-all duration-150 active:translate-y-0.5">
            [ View Guide ]
          </button>
        </div>

      </div>
    </section>
  );
}
