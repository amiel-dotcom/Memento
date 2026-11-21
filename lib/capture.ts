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

  const PW = 800;
  const PH = 600;
  const hasRemote = !!remote && remote.videoWidth > 0;

  const canvas = document.createElement("canvas");
  canvas.width = hasRemote ? PW * 2 : PW;
  canvas.height = PH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  drawCover(ctx, local, 0, 0, PW, PH, true);
  if (hasRemote && remote) drawCover(ctx, remote, PW, 0, PW, PH, false);

  return canvas.toDataURL("image/jpeg", 0.92);
}