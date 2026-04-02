export type FamilyRole =
  | "Self"
  | "Father"
  | "Mother"
  | "Wife"
  | "Husband"
  | "Brother"
  | "Sister"
  | "Brother-in-law"
  | "Sister-in-law"
  | "Son"
  | "Daughter"
  | "Uncle"
  | "Aunt"
  | "Grandfather"
  | "Grandmother"
  | "Nephew"
  | "Niece"
  | "Cousin";

export interface Position {
  x: number;
  y: number;
}

export interface Connection {
  targetId: string;
  label: string;
}

export interface FamilyNode {
  id: string;
  name: string;
  role: FamilyRole;
  generation: number;
  position: Position;
  connections: Connection[];
}

export interface TreeBounds {
  width: number;
  height: number;
}
