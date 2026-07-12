import html2canvas from "html2canvas";

import { DEGRADATION_PARAMS } from "@/constants/area-degradation";

export interface GlitchParams {
  downscale: number;
  jpegQuality: number;
  loops: number;
}

export const makeGlitchAsync = (
  sourceCanvas: HTMLCanvasElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  _params: GlitchParams,
): Promise<HTMLCanvasElement | null> => {
  return new Promise((resolve) => {
    const src = document.createElement("canvas");

    src.width = sw;
    src.height = sh;

    const srcCtx = src.getContext("2d");

    if (!srcCtx) {
      resolve(null);
      return;
    }
    srcCtx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

    const dw = Math.max(2, Math.round(sw * DEGRADATION_PARAMS.downscale));
    const dh = Math.max(2, Math.round(sh * DEGRADATION_PARAMS.downscale));

    const runLoop = (canvas: HTMLCanvasElement, count: number): void => {
      if (count <= 0) {
        const out = document.createElement("canvas");

        out.width = sw;
        out.height = sh;

        const oc = out.getContext("2d");

        if (!oc) {
          resolve(null);
          return;
        }

        oc.imageSmoothingEnabled = false;
        oc.drawImage(canvas, 0, 0, dw, dh, 0, 0, sw, sh);

        resolve(out);
        return;
      }

      const small = document.createElement("canvas");

      small.width = dw;
      small.height = dh;

      const sc = small.getContext("2d");

      if (!sc) {
        resolve(null);
        return;
      }

      sc.imageSmoothingEnabled = false;
      sc.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, dw, dh);

      const url = small.toDataURL("image/jpeg", DEGRADATION_PARAMS.jpegQuality);
      const img = new Image();

      img.onload = () => {
        const dec = document.createElement("canvas");

        dec.width = dw;
        dec.height = dh;

        const dc = dec.getContext("2d");

        if (!dc) {
          resolve(null);
          return;
        }

        dc.drawImage(img, 0, 0);
        runLoop(dec, count - 1);
      };
      img.src = url;
    };

    runLoop(src, DEGRADATION_PARAMS.loops);
  });
};

const jitter = (base: number, range: number): number => {
  return base + (Math.random() - 0.5) * 2 * range;
};

export const captureScene = async (ignoreElement: Element | null): Promise<HTMLCanvasElement> => {
  const W = window.innerWidth;
  const H = window.innerHeight;

  return html2canvas(document.documentElement, {
    backgroundColor: getComputedStyle(document.body).backgroundColor || "#F6F6F5",
    scale: 1,
    width: W,
    height: H,
    windowWidth: W,
    windowHeight: H,
    x: window.scrollX,
    y: window.scrollY,
    logging: false,
    useCORS: true,
    ignoreElements: (el) => el === ignoreElement,
  });
};

export const createGlitchRect = async (
  snap: HTMLCanvasElement,
  cx: number,
  cy: number,
): Promise<{ canvas: HTMLCanvasElement; x: number; y: number } | null> => {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const baseW = DEGRADATION_PARAMS.rectBaseW + (Math.random() - 0.5) * 60;
  const ratioVariance = DEGRADATION_PARAMS.rectRatioVariance + (Math.random() - 0.5) * 0.15;
  const variance = 1 + (Math.random() - 0.5) * ratioVariance * 2;
  const rw = Math.round(baseW);
  const rh = Math.round(baseW / ((16 / 9) * variance));
  const sx = Math.max(0, Math.min(W - rw, Math.round(cx - rw / 2)));
  const sy = Math.max(0, Math.min(H - rh, Math.round(cy - rh / 2)));

  const glitchParams: GlitchParams = {
    downscale: Math.max(0.01, Math.min(1, jitter(DEGRADATION_PARAMS.downscale, 0.15))),
    jpegQuality: Math.max(0.01, Math.min(1, jitter(DEGRADATION_PARAMS.jpegQuality, 0.05))),
    loops: DEGRADATION_PARAMS.loops,
  };

  const gc = await makeGlitchAsync(snap, sx, sy, rw, rh, glitchParams);

  if (!gc) return null;

  Object.assign(gc.style, {
    position: "absolute",
    left: `${sx}px`,
    top: `${sy}px`,
    width: `${rw}px`,
    height: `${rh}px`,
    imageRendering: "pixelated",
    display: "block",
  });

  return { canvas: gc, x: sx, y: sy };
};
