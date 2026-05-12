export const MAP_CONFIG = {
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  initialCenter: [6.6363, 49.8408] as [number, number],
  initialZoom: 14,
  minZoom: 12,
  maxZoom: 19,
  maxBounds: [
    [6.55, 49.8],
    [6.72, 49.89],
  ] as [[number, number], [number, number]],
} as const;

export const LAYER_CONFIG = {
  vulnerabilityExposure: {
    id: "vulnerability-exposure",
    label: "Vulnerability & Exposure",
    color: "#e85d04",
    iconSymbol: "🏠",
  },
  urbanDrainage: {
    id: "urban-drainage",
    label: "Urban Drainage",
    color: "#0ea5e9",
    iconSymbol: "🔵",
  },
  qualitativeHazard: {
    id: "qualitative-hazard",
    label: "Qualitative Hazard Assessment",
    color: "#ef4444", // High-visibility red for hazard points
    iconSymbol: "⚠️",
  },
} as const;

// Per asset-type icon mapping
export const DRAINAGE_ASSET_ICONS: Record<string, string> = {
  Manhole: "⬤",
  Pipe: "▬",
  Culvert: "◎",
  "Open Canal": "〰",
  "Outlet / Inlet": "◈",
  "Retention Basin": "🟦",
  Pump: "⚙",
  "Pump Station": "🔧",
  "Flood Protection": "🛡",
  "Treatment Plant": "🏭",
  Unknown: "❓",
};
