import { useRef } from "react";

import { useAreaDegradation } from "@/hooks/use-area-degradation";

export function AreaDegradationCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useAreaDegradation(containerRef);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    />
  );
}
