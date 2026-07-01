import { Suspense } from "react";

// import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Models } from "../animations/3d/Models";

export function LogoAnimation() {
  return (
    <div className="my-4 h-72 w-full border-[0.1px] border-dashed">
      <Canvas camera={{ position: [0, 3, 0], up: [0, 0, -1], fov: 50 }}>
        <gridHelper />
        {/*<OrbitControls />*/}
        <Suspense>
          <Models />
        </Suspense>
      </Canvas>
    </div>
  );
}
