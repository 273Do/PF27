import { Suspense } from "react";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import { CageModel } from "../animations/3d/cage-model";
import { LogoModel } from "../animations/3d/logo-model";

export function LogoAnimation() {
  return (
    <div className="my-4 h-72 w-full border-[0.1px] border-dashed">
      <Canvas camera={{ position: [0, 5, 0], up: [0, 0, -1], fov: 50 }}>
        <gridHelper />
        <OrbitControls />
        <Suspense>
          <Physics debug>
            <LogoModel />
            <CageModel />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
