import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      "h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-text outline-none transition-all duration-200 ease-snappy placeholder:text-muted/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
      className
    )}
    {...props}
  />
);
