import { ChevronDown, Sparkles } from "lucide-react";
import type { ChatMessage as Message } from "@/models/types";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { cn } from "@/utils/cn";

interface ChatDrawerProps {
  visible: boolean;
  isOpen: boolean;
  messages: Message[];
  inputValue: string;
  isTyping: boolean;
  onToggle: () => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export const ChatDrawer = ({
  visible,
  isOpen,
  messages,
  inputValue,
  isTyping,
  onToggle,
  onInputChange,
  onSend
}: ChatDrawerProps) => {
  if (!visible) return null;

  return (
    <section className="fixed inset-x-0 bottom-0 z-40 px-2 pb-2 sm:px-4">
      <div
        className={cn(
          "mx-auto w-full max-w-5xl overflow-hidden rounded-t-2xl border border-black/10 bg-[#fcfcfb] shadow-elevated transition-transform duration-300 ease-snappy",
          isOpen ? "translate-y-0" : "translate-y-[calc(100%-46px)]"
        )}
      >
        <button
          type="button"
          className="flex h-[46px] w-full items-center justify-between border-b border-black/10 bg-white px-4 text-sm font-semibold text-text hover:bg-primary/5"
          onClick={onToggle}
        >
          <span className="inline-flex items-center gap-2"><Sparkles size={16} /> ✦ Adjust with AI</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        <div className="flex h-[280px] flex-col sm:h-[320px]">
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((message) => (
              <ChatMessage key={message.id} role={message.role} content={message.content} />
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-black/10 bg-white px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted/70 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted/70 [animation-delay:120ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted/70 [animation-delay:220ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <ChatInput value={inputValue} isLoading={isTyping} onChange={onInputChange} onSend={onSend} />
        </div>
      </div>
    </section>
  );
};
