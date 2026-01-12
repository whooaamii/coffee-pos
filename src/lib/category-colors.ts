/* =========================
   CATEGORY COLOR TOKENS
========================= */

export const CATEGORY_COLOR_STYLES = {
  red: {
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-800 border-red-200",
  },
  amber: {
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  lime: {
    dot: "bg-lime-500",
    badge: "bg-lime-100 text-lime-800 border-lime-200",
  },
  gray: {
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-800 border-gray-200",
  },
  brown: {
    dot: "bg-[#8B5A2B]",
    badge: "bg-[#F3E9DF] text-[#5C3A1E] border-[#E4D3C3]",
  },
  cyan: {
    dot: "bg-cyan-500",
    badge: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  pink: {
    dot: "bg-pink-500",
    badge: "bg-pink-100 text-pink-800 border-pink-200",
  },
  violet: {
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-800 border-violet-200",
  },
  teal: {
    dot: "bg-teal-500",
    badge: "bg-teal-100 text-teal-800 border-teal-200",
  },
  orange: {
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-800 border-orange-200",
  },
  slate: {
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-800 border-slate-200",
  },
} as const;

/* =========================
   TYPES
========================= */

export type CategoryColor = keyof typeof CATEGORY_COLOR_STYLES;

/* =========================
   NORMALIZER
========================= */

export function toCategoryColor(value?: string): CategoryColor {
  if (!value) return "slate";
  if (value in CATEGORY_COLOR_STYLES) {
    return value as CategoryColor;
  }
  return "slate";
}
