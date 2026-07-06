import { useEffect, useState } from "react";

import { createWindowTracker, type MotionStateObj } from "@273do/winertia";

type TrackerState = MotionStateObj | null;

export const useWindowTracker = (): TrackerState => {
  const [state, setState] = useState<TrackerState>(null);

  useEffect(() => {
    const tracker = createWindowTracker({ historyLength: 0 });
    let rafId: number;

    const loop = () => {
      const result: TrackerState = tracker.update(performance.now(), 4000);
      if (result) setState(result);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return state;
};
