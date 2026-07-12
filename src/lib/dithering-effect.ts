import { Effect } from "postprocessing";
import * as THREE from "three";

import ditheringShader from "@/components/animations/3d/dithering.frag";
import { DITHER_DEFAULT_OPTIONS } from "@/constants/3d";

type DitheringEffectOptions = {
  time?: number;
  resolution?: THREE.Vector2;
  gridSize?: number;
  luminanceMethod?: number;
  invertColor?: boolean;
  pixelSizeRatio?: number;
  grayscaleOnly?: boolean;
  foregroundColor?: string;
  backgroundColor?: string;
};

const hexToVec3 = (hex: string): THREE.Vector3 => {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
};

export class DitheringEffect extends Effect {
  uniforms: Map<string, THREE.Uniform<number | THREE.Vector2 | THREE.Vector3>>;

  constructor(options: DitheringEffectOptions = {}) {
    const {
      time,
      resolution,
      gridSize,
      luminanceMethod,
      invertColor,
      pixelSizeRatio,
      grayscaleOnly,
      foregroundColor,
      backgroundColor,
    } = { ...DITHER_DEFAULT_OPTIONS, ...options };

    const uniforms = new Map<string, THREE.Uniform<number | THREE.Vector2 | THREE.Vector3>>([
      ["time", new THREE.Uniform(time)],
      ["resolution", new THREE.Uniform(resolution)],
      ["gridSize", new THREE.Uniform(gridSize)],
      ["luminanceMethod", new THREE.Uniform(luminanceMethod)],
      ["invertColor", new THREE.Uniform(invertColor ? 1 : 0)],
      ["ditheringEnabled", new THREE.Uniform(1)],
      ["pixelSizeRatio", new THREE.Uniform(pixelSizeRatio)],
      ["grayscaleOnly", new THREE.Uniform(grayscaleOnly ? 1 : 0)],
      ["foregroundColor", new THREE.Uniform(hexToVec3(foregroundColor))],
      ["backgroundColor", new THREE.Uniform(hexToVec3(backgroundColor))],
    ]);

    super("DitheringEffect", ditheringShader, { uniforms });

    this.uniforms = uniforms;
  }

  setSize(width: number, height: number) {
    const res = this.uniforms.get("resolution");
    if (res) (res.value as THREE.Vector2).set(width, height);
  }
}
