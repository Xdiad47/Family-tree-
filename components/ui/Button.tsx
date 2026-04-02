"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 ease-snappy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-primary text-white hover:bg-primaryHover",
        variant === "secondary" && "border border-black/10 bg-white text-text hover:border-primary/40 hover:text-primary",
        variant === "ghost" && "bg-transparent text-muted hover:bg-primary/10 hover:text-primary",
        className
      )}
      {...props}
    />
  );
};
