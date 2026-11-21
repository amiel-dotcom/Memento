import type { Theme } from "./themes";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function buildCollage(
  snaps: string[],
  theme: Theme,
  code: string
): Promise<string> {
  const imgs = await Promise.all(snaps.map(loadImage));

  const PAD = 48;
  const GAP = 32;
  const BORDER = 10;
  const FOOT = 130;
  const PHOTO_W = 600;
  const PHOTO_H = 450;

  const W = PHOTO_W + PAD * 2;
  const H = PAD + imgs.length * PHOTO_H + (imgs.length - 1) * GAP + FOOT;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas");

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, W, H);

  imgs.forEach((img, i) => {
    const x = PAD;
    const y = PAD + i * (PHOTO_H + GAP);

    ctx.fillStyle = theme.photoBorder;
    ctx.fillRect(x - BORDER, y - BORDER, PHOTO_W + BORDER * 2, PHOTO_H + BORDER * 2);

    const scale = Math.max(PHOTO_W / img.width, PHOTO_H / img.height);
    const sw = PHOTO_W / scale;
    const sh = PHOTO_H / scale;
    ctx.drawImage(
      img,
      (img.width - sw) / 2,
      (img.height - sh) / 2,
      sw,
      sh,
      x,
      y,
      PHOTO_W,
      PHOTO_H
    );
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