function drawCover(
  ctx: CanvasRenderingContext2D,
  v: HTMLVideoElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  mirror: boolean
) {
  const vw = v.videoWidth;
  const vh = v.videoHeight;
  const scale = Math.max(dw / vw, dh / vh);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (vw - sw) / 2;
  const sy = (vh - sh) / 2;

  ctx.save();
  if (mirror) {
    ctx.translate(dx + dw, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(v, sx, sy, sw, sh, 0, 0, dw, dh);
  } else {
    ctx.drawImage(v, sx, sy, sw, sh, dx, dy, dw, dh);
  }
  ctx.restore();
}

export function snapshot(
  local: HTMLVideoElement,
  remote: HTMLVideoElement | null
): string | null {
  if (!local.videoWidth) return null;

  const W = 1200;
  const H = 900;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const hasRemote = !!remote && remote.videoWidth > 0;

  if (hasRemote && remote) {
    drawCover(ctx, local, 0, 0, W / 2, H, true);
    drawCover(ctx, remote, W / 2, 0, W / 2, H, false);
  } else {
    drawCover(ctx, local, 0, 0, W, H, true);
  }

  return canvas.toDataURL("image/jpeg", 0.92);
}