import { CuboidCollider } from "@react-three/rapier";

const FLOOR_X = 4.9;
const FLOOR_Z = 2.07;
const FLOOR_Y = 0.5;
const WALL_H = 5;
const WALL_T = 0.1;
const WALL_Y = FLOOR_Y + WALL_H;

export function CageModel() {
  return (
    <group>
      {/* 床 */}
      <CuboidCollider position={[0, 0, 0]} args={[FLOOR_X, FLOOR_Y, FLOOR_Z]} restitution={0.1} />
      {/* 左壁 */}
      <CuboidCollider
        position={[-FLOOR_X, WALL_Y, 0]}
        args={[WALL_T, WALL_H, FLOOR_Z]}
        restitution={0.9}
      />
      {/* 右壁 */}
      <CuboidCollider
        position={[FLOOR_X, WALL_Y, 0]}
        args={[WALL_T, WALL_H, FLOOR_Z]}
        restitution={0.9}
      />
      {/* 前壁 */}
      <CuboidCollider
        position={[0, WALL_Y, -FLOOR_Z]}
        args={[FLOOR_X, WALL_H, WALL_T]}
        restitution={0.9}
      />
      {/* 後壁 */}
      <CuboidCollider
        position={[0, WALL_Y, FLOOR_Z]}
        args={[FLOOR_X, WALL_H, WALL_T]}
        restitution={0.9}
      />
    </group>
  );
}
