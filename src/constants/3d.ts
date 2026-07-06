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
