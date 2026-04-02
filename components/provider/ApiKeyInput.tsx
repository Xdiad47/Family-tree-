import { Eye, EyeOff, Link2, Unplug } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ApiKeyInputProps {
  providerName: string;
  placeholder: string;
  keyValue: string;
  isVisible: boolean;
  isConnected: boolean;
  isUsingFreePlan: boolean;
  creditsRemaining: number;
  onKeyChange: (value: string) => void;
  onToggleVisibility: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const ApiKeyInput = ({
  providerName,
  placeholder,
  keyValue,
  isVisible,
  isConnected,
  isUsingFreePlan,
  creditsRemaining,
  onKeyChange,
  onToggleVisibility,
  onConnect,
  onDisconnect
}: ApiKeyInputProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-text">Enter your {providerName} API Key</label>
      <div className="flex gap-2">
        <Input
          value={keyValue}
          onChange={(event) => onKeyChange(event.target.value)}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
        />
        <Button type="button" variant="secondary" onClick={onToggleVisibility} className="h-10 w-10 px-0">
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!isConnected && (
          <Button type="button" variant="secondary" onClick={onConnect}>
            <Link2 size={14} /> Connect Key
          </Button>
        )}

        {isConnected && (
          <>
            <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              {isUsingFreePlan
                ? `Connected ✓ Free Plan (${creditsRemaining} credits left)`
                : `Connected ✓ ${providerName} — Unlimited`}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted underline decoration-muted/50 underline-offset-2 hover:text-error"
              onClick={onDisconnect}
            >
              <Unplug size={14} /> Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
};
