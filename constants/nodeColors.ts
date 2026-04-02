import type { FamilyRole } from "@/models/FamilyNode";

export const NODE_ROLE_CLASSES: Record<FamilyRole, string> = {
  Self: "fill-node-self text-white",
  Father: "fill-node-parent text-white",
  Mother: "fill-node-parent text-white",
  Wife: "fill-node-spouse text-white",
  Husband: "fill-node-spouse text-white",
  Brother: "fill-node-sibling text-white",
  Sister: "fill-node-sibling text-white",
  "Brother-in-law": "fill-node-inlaw text-white",
  "Sister-in-law": "fill-node-inlaw text-white",
  Son: "fill-node-child text-white",
  Daughter: "fill-node-child text-white",
  Uncle: "fill-node-uncle text-slate-900",
  Aunt: "fill-node-uncle text-slate-900",
  Grandfather: "fill-node-grandparent text-white",
  Grandmother: "fill-node-grandparent text-white",
  Nephew: "fill-node-child text-white",
  Niece: "fill-node-child text-white",
  Cousin: "fill-node-inlaw text-white"
};

export const NODE_ROLE_HEX: Record<FamilyRole, string> = {
  Self: "#01696f",
  Father: "#006494",
  Mother: "#006494",
  Wife: "#c2185b",
  Husband: "#c2185b",
  Brother: "#437a22",
  Sister: "#437a22",
  "Brother-in-law": "#7a39bb",
  "Sister-in-law": "#7a39bb",
  Son: "#da7101",
  Daughter: "#da7101",
  Uncle: "#d19900",
  Aunt: "#d19900",
  Grandfather: "#37474f",
  Grandmother: "#37474f",
  Nephew: "#da7101",
  Niece: "#da7101",
  Cousin: "#7a39bb"
};

export const LEGEND_ITEMS = [
  { label: "Self", className: "bg-[#01696f]" },
  { label: "Father / Mother", className: "bg-[#006494]" },
  { label: "Wife / Husband", className: "bg-[#c2185b]" },
  { label: "Brother / Sister", className: "bg-[#437a22]" },
  { label: "In-laws / Cousin", className: "bg-[#7a39bb]" },
  { label: "Children / Niece / Nephew", className: "bg-[#da7101]" },
  { label: "Uncle / Aunt", className: "bg-[#d19900]" },
  { label: "Grandparents", className: "bg-[#37474f]" }
] as const;
