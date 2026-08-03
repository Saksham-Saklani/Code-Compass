import React, { memo } from "react";
import { PiCompassRoseFill } from "react-icons/pi";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Source {
  path: string;
  score: number;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  sources?: Source[];
  timestamp: string;
}

interface MessageItemProps {
  msg: Message;
}

export const MessageItem: React.FC<MessageItemProps> = memo(({ msg }) => {
  const isUser = msg.role === "user";

  if (msg.role === "system") {
    return (
      <div className="bg-[#1f521f]/5 border border-dashed border-[#1f521f]/30 p-4 rounded-xl text-xs font-mono text-[#33ff00]/80">
        <div className="text-[#ffb000] font-bold tracking-wider mb-1 uppercase">
          [ SYSTEM NOTICE // {msg.timestamp} ]
        </div>
        <pre className="whitespace-pre-wrap font-mono">{msg.text}</pre>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Assistant Star Icon - No background circle, aligned with first line of text */}
      {!isUser && (
        <PiCompassRoseFill className="w-[22px] h-[22px] text-[#33ff00] flex-shrink-0 mt-[28px] select-none" />
      )}

      <div
        className={`max-w-[85%] rounded-2xl select-text ${
          isUser
            ? "bg-[#1e1f20] text-white px-5 py-4 shadow-sm"
            : "text-[#e3e3e3] py-2 px-1 [&>*:first-child]:mt-0"
        }`}
      >
        {/* Message meta timing */}
        {isUser && (
          <div className="text-[12px] font-bold text-[#33ff00]/35 uppercase tracking-widest mb-1 select-none font-mono">
            User | {msg.timestamp}
          </div>
        )}

        {/* Content parsing */}
        <div className="space-y-2 break-words select-text">
          {isUser ? (
            <p className="whitespace-pre-wrap text-base md:text-[17px] leading-relaxed md:leading-loose font-sans font-normal text-white">
              {msg.text}
            </p>
          ) : (
            <div className="text-base md:text-[17px] leading-relaxed md:leading-loose font-sans font-normal">
              <MarkdownRenderer content={msg.text} />
            </div>
          )}
        </div>

        {/* Cited Sources matching */}
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#1f521f]/25 select-none font-mono">
            <div className="text-[10px] font-bold text-[#ffb000] uppercase tracking-wider mb-2">
              Referenced Files:
            </div>
            <div className="flex flex-wrap gap-2">
              {msg.sources.map((src, sIdx) => (
                <div
                  key={sIdx}
                  className="text-[10px] border border-[#1f521f] bg-[#1e1f20]/50 px-2 py-0.5 rounded text-[#33ff00]/70 flex items-center gap-1.5 max-w-xs truncate"
                  title={`${src.path} (Match Score: ${(src.score * 100).toFixed(0)}%)`}
                >
                  <span className="text-amber-500 font-bold">{(src.score * 100).toFixed(0)}%</span>
                  <span className="truncate">{src.path.split("/").pop()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";
