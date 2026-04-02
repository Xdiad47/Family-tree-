import type { ProviderConfig, ProviderId } from "@/models/types";
import { cn } from "@/utils/cn";

interface ProviderSelectorProps {
  providers: ProviderConfig[];
  activeProvider: ProviderId;
  onChange: (provider: ProviderId) => void;
}

export const ProviderSelector = ({ providers, activeProvider, onChange }: ProviderSelectorProps) => {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-black/10 sm:grid-cols-4" role="tablist">
      {providers.map((provider) => {
        const active = provider.id === activeProvider;
        return (
          <button
            key={provider.id}
            type="button"
            onClick={() => onChange(provider.id)}
            className={cn(
              "h-10 border-r border-b border-black/10 text-sm font-semibold transition-colors duration-200 ease-snappy last:border-r-0 sm:border-b-0",
              active ? "bg-primary/15 text-primary" : "bg-white text-muted hover:text-primary"
            )}
            aria-selected={active}
          >
            {provider.name}
          </button>
        );
      })}
    </div>
  );
};
