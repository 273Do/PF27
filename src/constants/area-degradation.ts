import type { GlitchParams } from "@/lib/area-degradation-render";

export const DEGRADATION_PARAMS: GlitchParams & {
  rectBaseW: number;
  rectRatioVariance: number;
  interval: number;
  maxRects: number;
  clearTime: number;
} = {
  downscale: 0.5,
  jpegQuality: 0.1,
  loops: 3,
  rectBaseW: 200,
  rectRatioVariance: 0.2,
  interval: 200,
  maxRects: 5,
  clearTime: 3000,
};
