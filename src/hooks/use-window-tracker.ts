import { useRef } from "react";

import { createWindowTracker, type MotionStateObj, type WindowTrackerObj } from "@273do/winertia";
import { useFrame } from "@react-three/fiber";

export const useWindowTracker = () => {
  const trackerRef = useRef<WindowTrackerObj | null>(null);

  if (!trackerRef.current) {
    trackerRef.current = createWindowTracker({ historyLength: 0 });
  }

  const stateRef = useRef<MotionStateObj | null>(null);

  useFrame(() => {
    const result = trackerRef.current!.update(performance.now(), 4000);

    if (result) stateRef.current = result;
  });

  return stateRef;
};
