import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-card border border-black/10 bg-surface p-4 shadow-soft", className)}
    {...props}
  />
);
