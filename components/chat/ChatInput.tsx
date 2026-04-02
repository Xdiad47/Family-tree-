import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ChatInputProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export const ChatInput = ({ value, isLoading, onChange, onSend }: ChatInputProps) => {
  return (
    <div className="flex items-center gap-2 border-t border-black/10 bg-white p-3">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSend();
          }
        }}
        placeholder="Add my sister Priya"
      />
      <Button type="button" onClick={onSend} disabled={isLoading || !value.trim()} className="h-10 w-10 px-0">
        <Send size={16} />
      </Button>
    </div>
  );
};
