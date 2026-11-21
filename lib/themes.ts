export const SNAP_OPTIONS = [3, 4, 5, 6] as const;

export type Theme = {
  id: string;
  name: string;
  bg: string;
  photoBorder: string;
  text: string;
};

export const THEMES: Theme[] = [
  { id: "classic", name: "Classic film", bg: "#18181B", photoBorder: "#F6F3EC", text: "#F6F3EC" },
  { id: "scrapbook", name: "Pastel scrapbook", bg: "#EBD3CB", photoBorder: "#FFFFFF", text: "#18181B" },
  { id: "polaroid", name: "Retro polaroid", bg: "#FBF8F1", photoBorder: "#FBF8F1", text: "#18181B" },
  { id: "contact", name: "Contact sheet", bg: "#D6D1C4", photoBorder: "#18181B", text: "#18181B" },
];