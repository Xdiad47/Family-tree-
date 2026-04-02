import type { FamilyNode, TreeBounds } from "@/models/FamilyNode";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 86;
const H_GAP = 60;
const V_GAP = 140;
const PADDING = 70;

const mapGenerationToRow = (generation: number): number => {
  if (generation <= -2) return 0;
  if (generation === -1) return 1;
  if (generation === 0) return 2;
  return 3;
};

export const autoLayoutNodes = (nodes: FamilyNode[]): { nodes: FamilyNode[]; bounds: TreeBounds } => {
  const laidOutNodes: FamilyNode[] = nodes.map((node) => {
    const safeGeneration = Number.isFinite(node.generation) ? node.generation : 0;
    return {
      ...node,
      generation: safeGeneration,
      position: {
        x: PADDING,
        y: PADDING + 2 * (NODE_HEIGHT + V_GAP)
      }
    };
  });

  const rows: FamilyNode[][] = [[], [], [], []];
  laidOutNodes.forEach((node) => rows[mapGenerationToRow(node.generation)].push(node));

  rows.forEach((row) => {
    row.sort((a, b) => {
      if (a.role === "Self") return -1;
      if (b.role === "Self") return 1;
      return a.name.localeCompare(b.name);
    });
  });

  const rowWidths = rows.map((row) => (row.length ? row.length * NODE_WIDTH + (row.length - 1) * H_GAP : 0));
  const maxRowWidth = Math.max(...rowWidths, NODE_WIDTH);
  const width = Math.max(1400, maxRowWidth + PADDING * 2);
  const height = Math.max(900, PADDING * 2 + NODE_HEIGHT * 4 + V_GAP * 3);
  const byId = new Map(laidOutNodes.map((node) => [node.id, node]));

  rows.forEach((row, rowIndex) => {
    if (!row.length) return;
    const rowWidth = rowWidths[rowIndex];
    const startX = Math.round((width - rowWidth) / 2);
    const y = PADDING + rowIndex * (NODE_HEIGHT + V_GAP);

    row.forEach((rowNode, index) => {
      const target = byId.get(rowNode.id);
      if (!target) return;
      target.position = { x: startX + index * (NODE_WIDTH + H_GAP), y };
    });
  });

  console.log("[treeLayoutService] Final positioned nodes:", laidOutNodes);

  return {
    nodes: laidOutNodes,
    bounds: {
      width,
      height
    }
  };
};

export const getNodeDimensions = (): { width: number; height: number } => ({
  width: NODE_WIDTH,
  height: NODE_HEIGHT
});
