"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EmptyTreeState } from "@/components/tree/EmptyTreeState";
import { ConnectionLayer } from "@/components/tree/ConnectionLayer";
import { PersonNode } from "@/components/tree/PersonNode";
import { TreeLegend } from "@/components/tree/TreeLegend";
import { TreeToolbar } from "@/components/tree/TreeToolbar";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { useZoomPan } from "@/hooks/useZoomPan";
import type { FamilyNode, TreeBounds } from "@/models/types";
import type { ZoomSignal } from "@/viewmodels/useTreeViewModel";

interface TreeCanvasProps {
  nodes: FamilyNode[];
  bounds: TreeBounds;
  isLoading: boolean;
  loadingStep: number;
  nodeWidth: number;
  nodeHeight: number;
  legendCollapsed: boolean;
  zoomSignal: ZoomSignal | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  onResetLayout: () => void;
  onDownload: (element: HTMLElement | null) => void;
  onLegendToggle: () => void;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  onNodeMoveEnd: (nodeId: string, x: number, y: number) => void;
}

export const TreeCanvas = ({
  nodes,
  bounds,
  isLoading,
  loadingStep,
  nodeWidth,
  nodeHeight,
  legendCollapsed,
  zoomSignal,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onResetLayout,
  onDownload,
  onLegendToggle,
  onNodeMove,
  onNodeMoveEnd
}: TreeCanvasProps) => {
  const hasNodes = nodes.length > 0;
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerEl);
  const viewportRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const handledZoomTokenRef = useRef<number | null>(null);
  const zoomPan = useZoomPan();
  const {
    state: zoomState,
    transform: zoomTransform,
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
  } = zoomPan;

  const svgWidth = useMemo(() => Math.max(bounds.width, size.width + 220), [bounds.width, size.width]);
  const svgHeight = useMemo(() => Math.max(bounds.height, size.height + 220), [bounds.height, size.height]);

  const zoomStateRef = useRef(zoomState);
  zoomStateRef.current = zoomState;

  const getLocalPoint = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const s = zoomStateRef.current;
      return {
        x: (clientX - rect.left - s.x) / s.scale,
        y: (clientY - rect.top - s.y) / s.scale
      };
    },
    []
  );

  // Track whether we need a pending auto-fit (nodes appeared but size wasn't ready)
  const pendingFitRef = useRef(false);
  const prevNodeCountRef = useRef(0);

  // Auto-fit whenever nodes go from 0 → N (tree first generated)
  useEffect(() => {
    const hadNodes = prevNodeCountRef.current > 0;
    const nowHasNodes = nodes.length > 0;
    prevNodeCountRef.current = nodes.length;

    if (!hadNodes && nowHasNodes) {
      // Nodes just appeared — try to fit, or mark pending if size isn't ready
      if (size.width > 0 && size.height > 0) {
        const fitScale = Math.min((size.width - 36) / bounds.width, (size.height - 36) / bounds.height, 1);
        const nextScale = Number.isFinite(fitScale) ? Math.max(0.3, fitScale) : 1;
        const offsetX = (size.width - bounds.width * nextScale) / 2;
        const offsetY = (size.height - bounds.height * nextScale) / 2;
        setTransform(nextScale, offsetX, offsetY);
      } else {
        pendingFitRef.current = true;
      }
    }
  }, [nodes.length, bounds.width, bounds.height, size.width, size.height, setTransform]);

  // Fulfill a pending fit once the container size becomes available
  useEffect(() => {
    if (pendingFitRef.current && size.width > 0 && size.height > 0 && nodes.length > 0) {
      pendingFitRef.current = false;
      const fitScale = Math.min((size.width - 36) / bounds.width, (size.height - 36) / bounds.height, 1);
      const nextScale = Number.isFinite(fitScale) ? Math.max(0.3, fitScale) : 1;
      const offsetX = (size.width - bounds.width * nextScale) / 2;
      const offsetY = (size.height - bounds.height * nextScale) / 2;
      setTransform(nextScale, offsetX, offsetY);
    }
  }, [size.width, size.height, bounds.width, bounds.height, nodes.length, setTransform]);

  // Handle explicit zoom signals from toolbar / viewmodel
  useEffect(() => {
    if (!zoomSignal) return;
    if (handledZoomTokenRef.current === zoomSignal.token) return;
    handledZoomTokenRef.current = zoomSignal.token;

    if (zoomSignal.command === "in") {
      zoomIn(size.width / 2, size.height / 2);
      return;
    }

    if (zoomSignal.command === "out") {
      zoomOut(size.width / 2, size.height / 2);
      return;
    }

    if (zoomSignal.command === "reset") {
      resetZoom();
      return;
    }

    if (zoomSignal.command === "fit" && size.width > 0 && size.height > 0) {
      const fitScale = Math.min((size.width - 36) / bounds.width, (size.height - 36) / bounds.height, 1);
      const nextScale = Number.isFinite(fitScale) ? Math.max(0.3, fitScale) : 1;
      const offsetX = (size.width - bounds.width * nextScale) / 2;
      const offsetY = (size.height - bounds.height * nextScale) / 2;
      setTransform(nextScale, offsetX, offsetY);
    }
  }, [bounds.height, bounds.width, resetZoom, setTransform, size.height, size.width, zoomIn, zoomOut, zoomSignal]);

  return (
    <div
      ref={setContainerEl}
      className="relative min-h-[500px] h-[calc(100vh-1rem)] overflow-hidden rounded-xl border border-black/10 bg-gradient-to-b from-white to-[#fdfcf8]"
    >
      <TreeToolbar
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitScreen={onFitScreen}
        onResetLayout={onResetLayout}
        onDownload={() => onDownload(canvasRef.current)}
      />
      <TreeLegend collapsed={legendCollapsed} onToggle={onLegendToggle} />

      <div ref={canvasRef} className="relative h-full w-full">
        {!hasNodes && <EmptyTreeState />}

        <svg
          ref={viewportRef}
          width="100%"
          height="100%"
          className="relative z-10 h-full w-full touch-none"
          onWheel={hasNodes ? onWheel : undefined}
          onMouseDown={hasNodes ? onMouseDown : undefined}
          onMouseMove={hasNodes ? onMouseMove : undefined}
          onMouseUp={hasNodes ? onMouseUp : undefined}
          onMouseLeave={hasNodes ? onMouseUp : undefined}
          onTouchStart={hasNodes ? onTouchStart : undefined}
          onTouchMove={hasNodes ? onTouchMove : undefined}
          onTouchEnd={hasNodes ? onTouchEnd : undefined}
        >
          <g transform={zoomTransform}>
            {hasNodes && (
              <>
                <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="transparent" />
                <ConnectionLayer nodes={nodes} nodeWidth={nodeWidth} nodeHeight={nodeHeight} />
                {nodes.map((node) => (
                  <PersonNode
                    key={node.id}
                    node={node}
                    nodeWidth={nodeWidth}
                    nodeHeight={nodeHeight}
                    getLocalPoint={getLocalPoint}
                    onMove={onNodeMove}
                    onMoveEnd={onNodeMoveEnd}
                  />
                ))}
              </>
            )}
          </g>
        </svg>
      </div>

      <LoadingOverlay isVisible={isLoading} currentStep={loadingStep} />
    </div>
  );
};
