import { Download, Minus, Plus, Scan, RotateCcw } from "lucide-react";

interface TreeToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  onResetLayout: () => void;
  onDownload: () => void;
}

export const TreeToolbar = ({ onZoomIn, onZoomOut, onFitScreen, onResetLayout, onDownload }: TreeToolbarProps) => {
  return (
    <div className="absolute right-3 top-3 z-20 flex gap-1 rounded-lg border border-black/10 bg-white/90 p-1 shadow-soft backdrop-blur">
      <button type="button" aria-label="Zoom In" onClick={onZoomIn} className="rounded-md p-2 text-muted hover:bg-primary/10 hover:text-primary">
        <Plus size={16} />
      </button>
      <button type="button" aria-label="Zoom Out" onClick={onZoomOut} className="rounded-md p-2 text-muted hover:bg-primary/10 hover:text-primary">
        <Minus size={16} />
      </button>
      <button type="button" aria-label="Fit to Screen" onClick={onFitScreen} className="rounded-md p-2 text-muted hover:bg-primary/10 hover:text-primary">
        <Scan size={16} />
      </button>
      <button type="button" aria-label="Reset Layout" onClick={onResetLayout} className="rounded-md p-2 text-muted hover:bg-primary/10 hover:text-primary">
        <RotateCcw size={16} />
      </button>
      <button type="button" aria-label="Download PNG" onClick={onDownload} className="rounded-md p-2 text-muted hover:bg-primary/10 hover:text-primary">
        <Download size={16} />
      </button>
    </div>
  );
};
