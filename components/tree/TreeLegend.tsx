import { ChevronDown, ChevronRight } from "lucide-react";
import { LEGEND_ITEMS } from "@/constants/nodeColors";
import { cn } from "@/utils/cn";

interface TreeLegendProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const TreeLegend = ({ collapsed, onToggle }: TreeLegendProps) => {
  return (
    <div className="absolute bottom-3 left-3 z-20 w-56 overflow-hidden rounded-lg border border-black/10 bg-white/95 shadow-soft">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-9 w-full items-center gap-2 px-3 text-sm font-semibold text-text transition-colors hover:bg-primary/10 hover:text-primary"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />} Legend
      </button>
      {!collapsed && (
        <div className="space-y-1 px-3 pb-3">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-muted">
              <span className={cn("h-3 w-3 rounded-[3px] border border-black/10", item.className)} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
