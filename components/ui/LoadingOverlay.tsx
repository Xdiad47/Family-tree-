import { cn } from "@/utils/cn";

interface LoadingOverlayProps {
  isVisible: boolean;
  currentStep: number;
}

const steps = ["Parsing your family...", "Building connections...", "Laying out tree..."];

export const LoadingOverlay = ({ isVisible, currentStep }: LoadingOverlayProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-white/85 backdrop-blur-sm transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden={!isVisible}
    >
      <div className="w-full max-w-xs rounded-2xl border border-black/10 bg-white p-5 shadow-elevated">
        <div className="mb-4 flex items-center justify-center">
          <svg viewBox="0 0 220 130" className="h-24 w-full">
            <g className="animate-pulse">
              <rect x="87" y="10" width="46" height="18" rx="6" className="fill-primary/35" />
              <rect x="35" y="55" width="46" height="18" rx="6" className="fill-primary/45" />
              <rect x="139" y="55" width="46" height="18" rx="6" className="fill-primary/45" />
              <rect x="87" y="98" width="46" height="18" rx="6" className="fill-primary/60" />
              <path d="M110 28 C110 41,58 42,58 55" className="fill-none stroke-primary/40" strokeWidth="2" />
              <path d="M110 28 C110 41,162 42,162 55" className="fill-none stroke-primary/40" strokeWidth="2" />
              <path d="M58 73 C58 84,110 86,110 98" className="fill-none stroke-primary/40" strokeWidth="2" />
              <path d="M162 73 C162 84,110 86,110 98" className="fill-none stroke-primary/40" strokeWidth="2" />
            </g>
          </svg>
        </div>

        <ol className="space-y-2 text-sm">
          {steps.map((step, index) => (
            <li
              key={step}
              className={cn(
                "rounded-md px-2 py-1 transition-all",
                index < currentStep && "bg-primary/10 text-primary",
                index === currentStep && "bg-primary/15 text-primary font-semibold",
                index > currentStep && "text-muted"
              )}
            >
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
