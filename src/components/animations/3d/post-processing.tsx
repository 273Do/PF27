import { EffectComposer, wrapEffect } from "@react-three/postprocessing";

import { DitheringEffect } from "./dithering-effect";

const Dithering = wrapEffect(DitheringEffect);

export function PostProcessing() {
  return (
    <EffectComposer>
      <Dithering />
    </EffectComposer>
  );
}
