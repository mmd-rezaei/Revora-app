import type { PaintFinish } from "./types";

export type PaintPreset = {
  id: string;
  name: string;
  hex: string;
  finish: PaintFinish;
};

export const PAINT_PRESETS: PaintPreset[] = [
  { id: "obsidian-black", name: "Obsidian Black", hex: "#0A0A0A", finish: "gloss" },
  { id: "racing-red", name: "Racing Red", hex: "#C0392B", finish: "metallic" },
  { id: "alpine-white", name: "Alpine White", hex: "#F5F5F5", finish: "gloss" },
  { id: "midnight-blue", name: "Midnight Blue", hex: "#1A5276", finish: "metallic" },
  { id: "gunmetal", name: "Gunmetal", hex: "#4A5568", finish: "metallic" },
  { id: "silver", name: "Silver", hex: "#BDC3C7", finish: "metallic" },
  { id: "british-racing-green", name: "British Racing Green", hex: "#1B4332", finish: "pearl" },
  { id: "carbon", name: "Carbon Fiber", hex: "#1C1C1C", finish: "matte" },
  { id: "toronto-red", name: "Toronto Red", hex: "#E11D2E", finish: "metallic" },
  { id: "frozen-grey", name: "Frozen Grey", hex: "#7F8C8D", finish: "matte" },
];

export const paintColors: Record<string, string> = Object.fromEntries(
  PAINT_PRESETS.map((p) => [p.name, p.hex]),
);

export function resolvePaintHex(paintName: string, customHex?: string): string {
  if (customHex && /^#[0-9A-Fa-f]{6}$/.test(customHex)) return customHex;
  return paintColors[paintName] || paintColors["Alpine White"];
}

export function finishRoughness(finish: PaintFinish): number {
  switch (finish) {
    case "matte":
      return 0.92;
    case "pearl":
      return 0.28;
    case "metallic":
      return 0.35;
    default:
      return 0.18;
  }
}

export function finishMetalness(finish: PaintFinish): number {
  return finish === "metallic" || finish === "pearl" ? 0.65 : 0.35;
}
