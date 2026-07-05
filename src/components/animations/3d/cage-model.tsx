import { useRef, type ComponentRef } from "react";

import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { useWindowTracker } from "@/hooks/use-wondow-tracker";

const FLOOR_X = 5.35;
const FLOOR_Z = 2.85;
const FLOOR_Y = 1;
const WALL_H = 5;
const WALL_T = 1.0;
const WALL_Y = FLOOR_Y + WALL_H;

export function CageModel() {
  const windowState = useWindowTracker();

  const ref = useRef<ComponentRef<typeof RigidBody>>(null);
  const pos = useRef({ x: 0, z: 0 });

  useFrame(() => {
    console.log(windowState?.didShake);
    if (!ref.current || !windowState?.acceleration) return;
    const { x, y } = windowState.acceleration;
    pos.current.x += x / 100000;
    pos.current.z += y / 100000;
    ref.current.setNextKinematicTranslation({ x: pos.current.x, y: 0, z: pos.current.z });
  });

  return (
    <RigidBody ref={ref} type="kinematicPosition">
      {/* 床 */}
      <CuboidCollider
        position={[0, 0, 0]}
        args={[FLOOR_X * 1.25, FLOOR_Y, FLOOR_Z * 1.25]}
        restitution={0.1}
      />
      {/* 左壁 */}
      <CuboidCollider
        position={[-FLOOR_X, WALL_Y, 0]}
        args={[WALL_T, WALL_H, FLOOR_Z]}
        restitution={0.1}
      />
      {/* 右壁 */}
      <CuboidCollider
        position={[FLOOR_X, WALL_Y, 0]}
        args={[WALL_T, WALL_H, FLOOR_Z]}
        restitution={0.1}
      />
      {/* 前壁 */}
      <CuboidCollider
        position={[0, WALL_Y, -FLOOR_Z]}
        args={[FLOOR_X, WALL_H, WALL_T]}
        restitution={0.1}
      />
      {/* 後壁 */}
      <CuboidCollider
        position={[0, WALL_Y, FLOOR_Z]}
        args={[FLOOR_X, WALL_H, WALL_T]}
        restitution={0.1}
      />
    </RigidBody>
  );
}
