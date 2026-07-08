import { Suspense } from "react";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import background from "@/assets/imgs/empty_warehouse_01_1k.hdr";

import { CageModel } from "../animations/3d/cage-model";
import { LogoModel } from "../animations/3d/logo-model";
import { PostProcessing } from "../animations/3d/post-processing";

const DEBUG_MODE = false;

export function LogoAnimation() {
  return (
    <div className="my-4 h-72 w-full border-[0.1px] border-dashed">
      <Canvas camera={{ position: [0, 5, 0], up: [0, 0, -1], fov: 50 }}>
        {DEBUG_MODE && (
          <>
            <gridHelper />
            <OrbitControls />
          </>
        )}
        <Suspense>
          <Physics debug={DEBUG_MODE}>
            <LogoModel />
            <CageModel />
            <Environment files={background} />
          </Physics>
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
