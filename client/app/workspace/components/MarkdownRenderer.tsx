import React, { memo } from "react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(
  ({ content }) => {
    const parseCodeStyles = (text: string) => {
      const codeParts = text.split(/(`.*?`)/g);
      return codeParts.map((cPart, cIdx) => {
        if (cPart.startsWith("`") && cPart.endsWith("`")) {
          return (
            <code
              key={cIdx}
              className="bg-[#1f521f]/20 border border-[#1f521f] text-[#33ff00] px-1.5 py-0.5 rounded font-mono text-sm mx-0.5"
            >
              {cPart.slice(1, -1)}
            </code>
          );
        }
        return cPart;
      });
    };

    const parseInlineStyles = (text: string) => {
      const boldParts = text.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith("**") && bPart.endsWith("**")) {
          const innerText = bPart.slice(2, -2);
          return (
            <strong key={bIdx} className="text-white font-bold">
              {parseCodeStyles(innerText)}
            </strong>
          );
        }
        return <span key={bIdx}>{parseCodeStyles(bPart)}</span>;
      });
    };

    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("```") && part.endsWith("```")) {
            const lines = part.slice(3, -3).trim().split("\n");
            let language = "code";
            let codeLines = lines;

            if (lines.length > 0 && /^[a-zA-Z0-9_-]+$/.test(lines[0])) {
              language = lines[0].toLowerCase();
              codeLines = lines.slice(1);
            }

            const codeContent = codeLines.join("\n");

            return (
              <div
                key={index}
                className="my-3 border border-[#1f521f]/40 bg-[#0c0c0d] rounded-xl overflow-hidden font-mono text-sm"
              >
                <div className="bg-[#18181b] px-4 py-2 border-b border-[#1f521f]/35 flex justify-between items-center text-xs text-[#33ff00]/70 select-none">
                  <span className="font-semibold uppercase tracking-wider">
                    {language}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(codeContent)}
                    className="hover:text-black hover:bg-[#33ff00] text-[10px] border border-[#1f521f]/50 px-2 py-0.5 rounded transition-all duration-150 active:translate-y-0.5 font-bold cursor-pointer text-[#33ff00]"
                  >
                    Copy
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-[#e3e3e3]/90 leading-relaxed select-text font-mono">
                  <code>{codeContent}</code>
                </pre>
              </div>
            );
          }

          const lines = part.split("\n");
          return lines.map((line, lIdx) => {
            if (line.startsWith("#")) {
              const level = line.match(/^#+/)?.[0].length || 1;
              const text = line.replace(/^#+\s*/, "");
              const sizeClass =
                level === 1
                  ? "text-2xl font-bold mt-6 mb-3 text-white"
                  : "text-xl font-semibold mt-5 mb-2.5 text-white";
              return (
                <div
                  key={`${index}-${lIdx}`}
                  className={`border-b border-[#1f521f]/10 pb-1.5 ${sizeClass}`}
                >
                  {parseInlineStyles(text)}
                </div>
              );
            }

            if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
              const text = line.replace(/^\s*[-*]\s*/, "");
              return (
                <div
                  key={`${index}-${lIdx}`}
                  className="flex items-start gap-2.5 my-2.5 pl-4"
                >
                  <span className="text-[#33ff00] font-bold select-none font-sans">
                    •
                  </span>
                  <span className="flex-1 text-[#e3e3e3]/90">
                    {parseInlineStyles(text)}
                  </span>
                </div>
              );
            }

            if (line.trim().match(/^\d+\.\s/)) {
              const text = line.replace(/^\s*\d+\.\s*/, "");
              const num = line.match(/^\s*(\d+)\./)?.[1] || "1";
              return (
                <div
                  key={`${index}-${lIdx}`}
                  className="flex items-start gap-2.5 my-2.5 pl-4"
                >
                  <span className="text-[#33ff00] font-bold select-none">
                    {num}.
                  </span>
                  <span className="flex-1 text-[#e3e3e3]/90">
                    {parseInlineStyles(text)}
                  </span>
                </div>
              );
            }

            if (line.trim() === "")
              return <div key={`${index}-${lIdx}`} className="h-4.5" />;

            return (
              <p
                key={`${index}-${lIdx}`}
                className="my-3.5 leading-loose text-[#e3e3e3]/95"
              >
                {parseInlineStyles(line)}
              </p>
            );
          });
        })}
      </>
    );
  },
);

MarkdownRenderer.displayName = "MarkdownRenderer";
