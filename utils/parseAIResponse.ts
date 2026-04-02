import type { FamilyNode, FamilyRole } from "@/models/FamilyNode";

const allowedRoles: ReadonlySet<FamilyRole> = new Set([
  "Self",
  "Father",
  "Mother",
  "Wife",
  "Husband",
  "Brother",
  "Sister",
  "Brother-in-law",
  "Sister-in-law",
  "Son",
  "Daughter",
  "Uncle",
  "Aunt",
  "Grandfather",
  "Grandmother",
  "Nephew",
  "Niece",
  "Cousin"
]);

export const parseAIResponse = (rawText: string): FamilyNode[] => {
  const text = rawText.trim().replace(/```json|```/gi, "").trim();
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("PARSE_ERROR");
    }
    parsed = JSON.parse(text.slice(start, end + 1));
  }

  if (!Array.isArray(parsed)) {
    throw new Error("PARSE_ERROR");
  }

  const normalized = parsed.map((item, index): FamilyNode => {
    const object = (item ?? {}) as Record<string, unknown>;
    const role = typeof object.role === "string" && allowedRoles.has(object.role as FamilyRole)
      ? (object.role as FamilyRole)
      : "Cousin";

    const safeConnections = Array.isArray(object.connections)
      ? object.connections
          .map((entry) => {
            const connection = (entry ?? {}) as Record<string, unknown>;
            const targetId = typeof connection.targetId === "string" ? connection.targetId.trim() : "";
            const label = typeof connection.label === "string" ? connection.label.trim() : "";
            return { targetId, label };
          })
          .filter((entry) => entry.targetId.length > 0)
      : [];

    const generation = Number.isFinite(object.generation)
      ? Number(object.generation)
      : Number.parseInt(String(object.generation ?? 0), 10) || 0;

    return {
      id: typeof object.id === "string" && object.id.trim() ? object.id.trim() : `person_${index + 1}`,
      name:
        typeof object.name === "string" && object.name.trim()
          ? object.name.trim()
          : `Person ${index + 1}`,
      role,
      generation,
      position: { x: 0, y: 0 },
      connections: safeConnections
    };
  });

  if (normalized.length === 0) {
    throw new Error("PARSE_ERROR");
  }

  return normalized;
};
