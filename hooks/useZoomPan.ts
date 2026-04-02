"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { MouseEvent, TouchEvent, WheelEvent } from "react";

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

interface ZoomPanState {
  scale: number;
  x: number;
  y: number;
}

const MIN_SCALE = 0.3;
const MAX_SCALE = 3;

export const useZoomPan = () => {
  const [state, setState] = useState<ZoomPanState>({ scale: 1, x: 0, y: 0 });
  const panRef = useRef<{ active: boolean; startX: number; startY: number }>({
    active: false,
    startX: 0,
    startY: 0
  });
  const pinchRef = useRef<{ active: boolean; distance: number; centerX: number; centerY: number }>({
    active: false,
    distance: 0,
    centerX: 0,
    centerY: 0
  });

  const applyZoomAt = useCallback((factor: number, anchorX: number, anchorY: number) => {
    setState((prev) => {
      const nextScale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE);
      const worldX = (anchorX - prev.x) / prev.scale;
      const worldY = (anchorY - prev.y) / prev.scale;
      return {
        scale: nextScale,
        x: anchorX - worldX * nextScale,
        y: anchorY - worldY * nextScale
      };
    });
  }, []);

  const zoomIn = useCallback((anchorX = 0, anchorY = 0) => applyZoomAt(1.2, anchorX, anchorY), [applyZoomAt]);
  const zoomOut = useCallback((anchorX = 0, anchorY = 0) => applyZoomAt(0.85, anchorX, anchorY), [applyZoomAt]);

  const resetZoom = useCallback(() => {
    setState({ scale: 1, x: 0, y: 0 });
  }, []);

  const setTransform = useCallback((scale: number, x: number, y: number) => {
    setState({ scale: clamp(scale, MIN_SCALE, MAX_SCALE), x, y });
  }, []);

  const onWheel = useCallback(
    (event: WheelEvent<Element>) => {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const anchorX = event.clientX - rect.left;
      const anchorY = event.clientY - rect.top;
      applyZoomAt(event.deltaY < 0 ? 1.1 : 0.9, anchorX, anchorY);
    },
    [applyZoomAt]
  );

  const stateRef = useRef(state);
  stateRef.current = state;

  const onMouseDown = useCallback((event: MouseEvent<Element>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const s = stateRef.current;
    panRef.current = { active: true, startX: event.clientX - s.x, startY: event.clientY - s.y };
  }, []);

  const onMouseMove = useCallback((event: MouseEvent<Element>) => {
    if (!panRef.current.active) return;
    setState((prev) => ({
      ...prev,
      x: event.clientX - panRef.current.startX,
      y: event.clientY - panRef.current.startY
    }));
  }, []);

  const onMouseUp = useCallback(() => {
    panRef.current.active = false;
  }, []);

  const getTouchDistance = (touches: TouchEvent<Element>["touches"]): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: TouchEvent<Element>["touches"]): { x: number; y: number } => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2
  });

  const onTouchStart = useCallback((event: TouchEvent<Element>) => {
    if (event.touches.length !== 2) return;
    const center = getTouchCenter(event.touches);
    pinchRef.current = {
      active: true,
      distance: getTouchDistance(event.touches),
      centerX: center.x,
      centerY: center.y
    };
  }, []);

  const onTouchMove = useCallback(
    (event: TouchEvent<Element>) => {
      if (!pinchRef.current.active || event.touches.length !== 2) return;

      const nextDistance = getTouchDistance(event.touches);
      const rawFactor = nextDistance / pinchRef.current.distance;
      // Dampen the factor for smoother pinch-to-zoom (halve the delta)
      const factor = 1 + (rawFactor - 1) * 0.5;
      // Ignore very tiny pinch movements to avoid jitter
      if (Math.abs(factor - 1) < 0.005) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const center = getTouchCenter(event.touches);

      applyZoomAt(factor, center.x - rect.left, center.y - rect.top);
      pinchRef.current.distance = nextDistance;
    },
    [applyZoomAt]
  );

  const onTouchEnd = useCallback(() => {
    pinchRef.current.active = false;
  }, []);

  const transform = useMemo(() => `translate(${state.x} ${state.y}) scale(${state.scale})`, [state.scale, state.x, state.y]);

  return {
    state,
    transform,
    setTransform,
    zoomIn,
    zoomOut,
    resetZoom,
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};
