import type * as THREE from "three";

import { useGLTF } from "@react-three/drei";
import { RigidBody, Physics } from "@react-three/rapier";

import modelPath from "@/assets/models/logo.glb";

useGLTF.preload(modelPath);

export function Models() {
  const { nodes } = useGLTF(modelPath);

  return (
    <Physics debug paused>
      <group scale={30}>
        {Object.entries(nodes)
          .filter(([_, obj]) => obj.type === "Mesh")
          .map(([key, mesh]) => {
            return (
              <RigidBody key={key} colliders="hull" ccd friction={1} restitution={0.9}>
                <mesh geometry={(mesh as THREE.Mesh).geometry}>
                  <meshNormalMaterial />
                </mesh>
              </RigidBody>
            );
          })}
      </group>
    </Physics>
  );
}
