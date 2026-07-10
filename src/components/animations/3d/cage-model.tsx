import { useRef, type ComponentRef, type RefObject } from "react";

import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { CAGE } from "@/constants/3d";
import type { DeviceMotion } from "@/hooks/use-device-motion";
import { useWindowTracker } from "@/hooks/use-window-tracker";

const { FLOOR_X, FLOOR_Y, FLOOR_Z, WALL_H, WALL_T, WALL_Y } = CAGE;

type Props = {
  deviceMotionRef?: RefObject<DeviceMotion>;
};

export function CageModel({ deviceMotionRef }: Props) {
  const trackerStateRef = useWindowTracker();

  const ref = useRef<ComponentRef<typeof RigidBody>>(null);
  const pos = useRef({ x: 0, z: 0 });

  useFrame(() => {
    if (!ref.current) return;

    if (deviceMotionRef?.current) {
      const { x, y } = deviceMotionRef.current;

      // シェイクの強さに応じて押し出し、常に原点へ引き戻す
      pos.current.x += x / 30;
      pos.current.z += y / 30;
      pos.current.x *= 0.9;
      pos.current.z *= 0.9;
    } else {
      const motion = trackerStateRef.current;

      if (!motion) return;

      const { x, y } = motion.acceleration;

      pos.current.x += x / 100000;
      pos.current.z += y / 100000;
    }

    ref.current.setNextKinematicTranslation({ x: pos.current.x, y: 0, z: pos.current.z });
  });

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders="cuboid">
      {/* 床 */}
      <CuboidCollider
        position={[0, 0, 0]}
        args={[FLOOR_X * 1.25, FLOOR_Y, FLOOR_Z * 1.25]}
        restitution={0.1}
      />
      {/*　天井　*/}
      <CuboidCollider
        position={[0, WALL_H * 2, 0]}
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
