"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseDragParams {
  onDragStart?: () => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd?: () => void;
  getLocalPoint: (clientX: number, clientY: number) => { x: number; y: number };
  initialPosition: { x: number; y: number };
}

export const useDrag = ({
  onDragStart,
  onDragMove,
  onDragEnd,
  getLocalPoint,
  initialPosition
}: UseDragParams) => {
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const teardownRef = useRef<(() => void) | null>(null);
  const onDragStartRef = useRef(onDragStart);
  const onDragMoveRef = useRef(onDragMove);
  const onDragEndRef = useRef(onDragEnd);
  const getLocalPointRef = useRef(getLocalPoint);
  const initialPositionRef = useRef(initialPosition);

  useEffect(() => {
    onDragStartRef.current = onDragStart;
  }, [onDragStart]);

  useEffect(() => {
    onDragMoveRef.current = onDragMove;
  }, [onDragMove]);

  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  useEffect(() => {
    getLocalPointRef.current = getLocalPoint;
  }, [getLocalPoint]);

  useEffect(() => {
    initialPositionRef.current = initialPosition;
  }, [initialPosition]);

  useEffect(() => {
    return () => {
      if (teardownRef.current) {
        teardownRef.current();
        teardownRef.current = null;
      }
    };
  }, []);

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragOffsetRef.current) return;
    const local = getLocalPointRef.current(clientX, clientY);
    onDragMoveRef.current(local.x - dragOffsetRef.current.x, local.y - dragOffsetRef.current.y);
  }, []);

  const endDrag = useCallback(() => {
    if (!dragOffsetRef.current) return;
    dragOffsetRef.current = null;
    if (teardownRef.current) {
      teardownRef.current();
      teardownRef.current = null;
    }
    onDragEndRef.current?.();
  }, []);

  const beginDrag = useCallback(
    (clientX: number, clientY: number) => {
      const local = getLocalPointRef.current(clientX, clientY);
      const initial = initialPositionRef.current;
      dragOffsetRef.current = {
        x: local.x - initial.x,
        y: local.y - initial.y
      };
      onDragStartRef.current?.();

      const onMouseMove = (event: MouseEvent) => {
        moveDrag(event.clientX, event.clientY);
      };
      const onMouseUp = () => {
        endDrag();
      };
      const onTouchMove = (event: TouchEvent) => {
        if (!event.touches[0]) return;
        event.preventDefault();
        moveDrag(event.touches[0].clientX, event.touches[0].clientY);
      };
      const onTouchEnd = () => {
        endDrag();
      };

      if (teardownRef.current) {
        teardownRef.current();
      }

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
      window.addEventListener("touchcancel", onTouchEnd);

      teardownRef.current = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
      };
    },
    [endDrag, moveDrag]
  );

  return {
    beginDrag,
    endDrag,
    isDragging: Boolean(dragOffsetRef.current)
  };
};
