import { useRef } from "react";

import { useAreaDegradation } from "@/hooks/use-area-degradation";

type Props = {
  disabled?: boolean;
};

export function AreaDegradationCanvas({ disabled = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useAreaDegradation(containerRef);

  return (
    !disabled && (
      <div
        ref={containerRef}
        className="hidden sm:block"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "hidden",
        }}
      />
    )
  );
}
