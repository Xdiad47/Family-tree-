import { NODE_ROLE_HEX } from "@/constants/nodeColors";
import type { FamilyNode } from "@/models/FamilyNode";

interface ConnectionLayerProps {
  nodes: FamilyNode[];
  nodeWidth: number;
  nodeHeight: number;
}

const toRgba = (hex: string, alpha: number): string => {
  const value = hex.replace("#", "");
  const int = Number.parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ConnectionLayer = ({ nodes, nodeWidth, nodeHeight }: ConnectionLayerProps) => {
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <g>
      <defs>
        {Object.entries(NODE_ROLE_HEX).map(([role, color]) => (
          <marker
            key={role}
            id={`arrow-${role.replaceAll(" ", "-")}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        ))}
      </defs>

      {nodes.flatMap((source) => {
        const sourceX = source.position.x + nodeWidth / 2;
        const sourceY = source.position.y + nodeHeight / 2;
        return source.connections.map((connection) => {
          const target = byId.get(connection.targetId);
          if (!target) {
            return null;
          }

          const targetX = target.position.x + nodeWidth / 2;
          const targetY = target.position.y + nodeHeight / 2;
          const deltaY = targetY - sourceY;
          const deltaX = targetX - sourceX;
          const bend = Math.max(42, Math.min(130, Math.abs(deltaY) * 0.8));
          const dir = deltaY >= 0 ? 1 : -1;

          // Normal vector calculation to elegantly separate opposing edge texts
          const distanceSq = deltaX * deltaX + deltaY * deltaY;
          const distance = Math.sqrt(distanceSq);
          let nx = 0;
          let ny = 0;
          if (distance > 0) {
            nx = -deltaY / distance;
            ny = deltaX / distance;
          }

          // Scale horizontal shift more heavily since text is wider than it is tall
          const offsetX = nx * 34;
          const offsetY = ny * 14;

          const textX = (sourceX + targetX) / 2 + offsetX;
          const textY = (sourceY + targetY) / 2 + offsetY;

          const c1x = sourceX;
          const c1y = sourceY + bend * dir;
          const c2x = targetX;
          const c2y = targetY - bend * dir;

          const pathD = `M ${sourceX} ${sourceY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${targetX} ${targetY}`;
          const markerId = `arrow-${source.role.replaceAll(" ", "-")}`;

          return (
            <g key={`${source.id}-${connection.targetId}-${connection.label}`}>
              <path
                d={pathD}
                fill="none"
                stroke={toRgba(NODE_ROLE_HEX[source.role], 0.72)}
                strokeWidth="2"
                markerEnd={`url(#${markerId})`}
              />
              {connection.label && (
                <g>
                  {/* Provide a solid underlying line-break outline effect like Figma lines */}
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    className="text-[11px] font-medium"
                  >
                    {connection.label}
                  </text>
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted text-[11px] font-medium"
                  >
                    {connection.label}
                  </text>
                </g>
              )}
            </g>
          );
        });
      })}
    </g>
  );
};
