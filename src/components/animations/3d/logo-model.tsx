import type * as THREE from "three";

import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

import modelPath from "@/assets/models/logo.glb";

import { LogoMaterial } from "./logo-material";

useGLTF.preload(modelPath);

export function LogoModel() {
  const { nodes } = useGLTF(modelPath);

  return (
    <group scale={50} position={[0, 6, 0]}>
      {Object.entries(nodes)
        .filter(([_, obj]) => obj.type === "Mesh")
        .map(([key, mesh]) => {
          return (
            <RigidBody key={key} colliders="hull" ccd friction={1} restitution={0.1}>
              <mesh geometry={(mesh as THREE.Mesh).geometry}>
                <LogoMaterial />
              </mesh>
            </RigidBody>
          );
        })}
    </group>
  );
}
