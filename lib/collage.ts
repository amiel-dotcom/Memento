import type { Theme } from "./themes";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawFramed(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  sx: number,
  sw: number,
  x: number,
  y: number,
  w: number,
  h: number,
  border: number,
  borderColor: string
) {
  ctx.fillStyle = borderColor;
  ctx.fillRect(x - border, y - border, w + border * 2, h + border * 2);

  const sh = img.height;
  const scale = Math.max(w / sw, h / sh);
  const cw = w / scale;
  const ch = h / scale;
  ctx.drawImage(img, sx + (sw - cw) / 2, (sh - ch) / 2, cw, ch, x, y, w, h);
}

export async function buildCollage(
  snaps: string[],
  theme: Theme,
  code: string
): Promise<string> {
  const imgs = await Promise.all(snaps.map(loadImage));
  const paired = imgs.some((i) => i.width / i.height > 2);
  const cols = paired ? 2 : 1;

  const PAD = 48;
  const GAP = 32;
  const COL_GAP = 40;
  const BORDER = 10;
  const FOOT = 130;
  const PHOTO_W = paired ? 440 : 600;
  const PHOTO_H = paired ? 330 : 450;

  const W = PAD * 2 + cols * PHOTO_W + (cols - 1) * COL_GAP;
  const H = PAD + imgs.length * PHOTO_H + (imgs.length - 1) * GAP + FOOT;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas");

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, W, H);

  imgs.forEach((img, i) => {
    const y = PAD + i * (PHOTO_H + GAP);
    const isPair = img.width / img.height > 2;

    if (isPair) {
      const half = img.width / 2;
      drawFramed(ctx, img, 0, half, PAD, y, PHOTO_W, PHOTO_H, BORDER, theme.photoBorder);
      drawFramed(
        ctx,
        img,
        half,
        half,
        PAD + PHOTO_W + COL_GAP,
        y,
        PHOTO_W,
        PHOTO_H,
        BORDER,
        theme.photoBorder
      );
    } else {
      const x = PAD + ((cols - 1) * (PHOTO_W + COL_GAP)) / 2;
      drawFramed(ctx, img, 0, img.width, x, y, PHOTO_W, PHOTO_H, BORDER, theme.photoBorder);
    }
  });

  const date = new Date()
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();

  ctx.fillStyle = theme.text;
  ctx.textAlign = "center";
  ctx.font = "italic 46px Georgia, serif";
  ctx.fillText("Memento", W / 2, H - FOOT + 62);
  ctx.font = "20px monospace";
  ctx.fillText(`${code}  ·  ${date}`, W / 2, H - FOOT + 100);

  return canvas.toDataURL("image/png");
}