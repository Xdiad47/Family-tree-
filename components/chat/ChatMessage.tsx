import { cn } from "@/utils/cn";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
          role === "user" ? "rounded-br-md bg-primary text-white" : "rounded-bl-md border border-black/10 bg-white text-text"
        )}
      >
        {content}
      </div>
    </div>
  );
};
