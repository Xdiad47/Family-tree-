"use client";

import { useEffect, useRef } from "react";
import { NODE_ROLE_HEX } from "@/constants/nodeColors";
import { useDrag } from "@/hooks/useDrag";
import type { FamilyNode } from "@/models/FamilyNode";

interface PersonNodeProps {
  node: FamilyNode;
  nodeWidth: number;
  nodeHeight: number;
  getLocalPoint: (clientX: number, clientY: number) => { x: number; y: number };
  onMove: (nodeId: string, x: number, y: number) => void;
  onMoveEnd: (nodeId: string, x: number, y: number) => void;
}

export const PersonNode = ({ node, nodeWidth, nodeHeight, getLocalPoint, onMove, onMoveEnd }: PersonNodeProps) => {
  const latestPositionRef = useRef({ x: node.position.x, y: node.position.y });

  useEffect(() => {
    latestPositionRef.current = { x: node.position.x, y: node.position.y };
  }, [node.position.x, node.position.y]);

  const { beginDrag } = useDrag({
    getLocalPoint,
    initialPosition: node.position,
    onDragMove: (x, y) => {
      const nextX = Math.max(0, x);
      const nextY = Math.max(0, y);
      latestPositionRef.current = { x: nextX, y: nextY };
      onMove(node.id, nextX, nextY);
    },
    onDragEnd: () => {
      onMoveEnd(node.id, latestPositionRef.current.x, latestPositionRef.current.y);
    }
  });

  const roleTextColor = node.role === "Uncle" || node.role === "Aunt" ? "#1f2937" : "#ffffff";

  return (
    <g
      transform={`translate(${node.position.x} ${node.position.y})`}
      onMouseDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        beginDrag(event.clientX, event.clientY);
      }}
      onTouchStart={(event) => {
        if (!event.touches[0]) return;
        event.preventDefault();
        event.stopPropagation();
        beginDrag(event.touches[0].clientX, event.touches[0].clientY);
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <title>{`${node.name} — ${node.role}`}</title>
      <rect
        width={nodeWidth}
        height={nodeHeight}
        rx="10"
        ry="10"
        fill={NODE_ROLE_HEX[node.role]}
        className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.14)]"
      />
      <rect x="0" y={nodeHeight * 0.68} width={nodeWidth} height={nodeHeight * 0.32} fill="rgba(0,0,0,0.14)" />
      <text x={nodeWidth / 2} y={28} textAnchor="middle" fill={roleTextColor} className="text-[14px] font-bold">
        {node.name}
      </text>
      <text
        x={nodeWidth / 2}
        y={nodeHeight - 10}
        textAnchor="middle"
        fill={node.role === "Uncle" || node.role === "Aunt" ? "rgba(17,24,39,0.86)" : "rgba(255,255,255,0.84)"}
        className="text-[11px] font-medium"
      >
        {node.role}
      </text>
    </g>
  );
};
