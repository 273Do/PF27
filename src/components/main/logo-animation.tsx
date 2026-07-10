import { Suspense } from "react";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import background from "@/assets/imgs/empty_warehouse_01_1k.hdr";
import { useDeviceMotion } from "@/hooks/use-device-motion";

import { CageModel } from "../animations/3d/cage-model";
import { LogoModel } from "../animations/3d/logo-model";
import { PostProcessing } from "../animations/3d/post-processing";

const DEBUG_MODE = false;

const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export function LogoAnimation() {
  const { motionRef, permissionGranted, requestPermission } = useDeviceMotion();

  const showCanvas = !isMobile || permissionGranted;

  return (
    <div className="relative my-4 h-72 w-full border-[0.1px] border-dashed">
      {!showCanvas ? (
        <div className="flex h-full items-center justify-center">
          <button
            onClick={requestPermission}
            className="cursor-pointer text-sm text-muted-foreground"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <p className="w-fit bg-primary leading-tight text-secondary">CLICK HERE</p>
                <p>to Enable Motion.</p>
              </div>
              <p>Please grant permission for the accelerometer.</p>
            </div>
          </button>
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, 5, 0], up: [0, 0, -1], fov: 50 }}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            alpha: true,
          }}
          scene={{ background: null }}
        >
          {DEBUG_MODE && (
            <>
              <gridHelper />
              <OrbitControls />
            </>
          )}
          <Suspense>
            <Physics debug={DEBUG_MODE}>
              <LogoModel />
              <CageModel deviceMotionRef={isMobile ? motionRef : undefined} />
              <Environment files={background} />
            </Physics>
            <PostProcessing />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
