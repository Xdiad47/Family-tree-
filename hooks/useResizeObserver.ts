"use client";

import { useEffect, useState } from "react";

export interface Size {
  width: number;
  height: number;
}

export const useResizeObserver = <T extends HTMLElement>(target: T | null): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!target) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [target]);

  return size;
};
