import { useCallback, useEffect, useRef } from "react";

import { DEGRADATION_PARAMS } from "@/constants/area-degradation";
import { captureScene, createGlitchRect } from "@/lib/area-degradation-render";

export function useAreaDegradation(containerRef: React.RefObject<HTMLDivElement | null>) {
  const snapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isCapturingRef = useRef(false);
  const isMovingRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  const capture = useCallback(async (): Promise<void> => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;
    try {
      snapCanvasRef.current = await captureScene(containerRef.current);
    } finally {
      isCapturingRef.current = false;
    }
  }, [containerRef]);

  const spawnRect = useCallback(
    async (cx: number, cy: number): Promise<void> => {
      await capture();
      const snap = snapCanvasRef.current;
      const container = containerRef.current;
      if (!snap || !container) return;

      const result = await createGlitchRect(snap, cx, cy);
      if (!result || !container) return;

      container.appendChild(result.canvas);

      while (container.children.length > DEGRADATION_PARAMS.maxRects) {
        container.removeChild(container.firstChild!);
      }

      setTimeout(() => {
        if (container.contains(result.canvas)) container.removeChild(result.canvas);
      }, DEGRADATION_PARAMS.clearTime);
    },
    [capture, containerRef],
  );

  useEffect(() => {
    let moveStopTimer: ReturnType<typeof setTimeout> | undefined;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const target = e.target as Element | null;
      const overCanvas = target?.tagName === "CANVAS" || !!target?.closest("canvas");
      isMovingRef.current = !overCanvas;
      clearTimeout(moveStopTimer);
      moveStopTimer = setTimeout(() => {
        isMovingRef.current = false;
      }, 150);
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      clearTimeout(moveStopTimer);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (isMovingRef.current) {
        void spawnRect(mouseRef.current.x, mouseRef.current.y);
      }
    }, DEGRADATION_PARAMS.interval);
    return () => clearInterval(id);
  }, [spawnRect]);
}
