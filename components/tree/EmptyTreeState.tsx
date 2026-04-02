import { Trees } from "lucide-react";

export const EmptyTreeState = () => {
  return (
    <div className="pointer-events-none absolute inset-3 z-10 flex items-center justify-center rounded-xl border border-dashed border-black/20 bg-gradient-to-b from-white to-[#fdfcf8] md:inset-4">
      <div className="max-w-xs px-4 text-center text-muted">
        <Trees className="mx-auto mb-3 h-14 w-14 opacity-70" />
        <p className="text-base font-semibold text-text">Your family tree will appear here</p>
        <p className="mt-1 text-sm">Describe your family and click Generate to build an interactive map.</p>
      </div>
    </div>
  );
};
