import * as THREE from "three";

export const CAGE = {
  FLOOR_X: 5.35,
  FLOOR_Z: 2.85,
  FLOOR_Y: 1,
  WALL_H: 5,
  WALL_T: 1.0,
  get WALL_Y() {
    return this.FLOOR_Y + this.WALL_H;
  },
} as const;

export const DITHER_DEFAULT_OPTIONS = {
  time: 0,
  resolution: new THREE.Vector2(1, 1),
  gridSize: 4.0,
  luminanceMethod: 0,
  invertColor: false,
  pixelSizeRatio: 5,
  grayscaleOnly: true,
  foregroundColor: "#1B1A18",
  backgroundColor: "#F6F6F5",
};
