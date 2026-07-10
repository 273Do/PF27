import { useEffect, useRef, useState } from "react";

export type DeviceMotion = {
  x: number;
  y: number;
};

const DEAD_ZONE = 2.0; // m/s²

// ベースラインが現在値へ追従する速さ（0〜1、大きいほど早く追従）
const BASELINE_FOLLOW = 0.02;

const applyDeadZone = (v: number) => (Math.abs(v) < DEAD_ZONE ? 0 : v);

export const useDeviceMotion = () => {
  const motionRef = useRef<DeviceMotion>({ x: 0, y: 0 });

  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = async () => {
    // iOS は手動で権限を付与する必要がある
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === "function"
    ) {
      const result = await (
        DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }
      ).requestPermission();
      setPermissionGranted(result === "granted");
    } else {
      // Android は権限不要
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    if (!permissionGranted) return;

    // 許可直後の値を持ち方の傾き分としてベースラインに記録する
    let baseline: DeviceMotion | null = null;

    const handler = (e: DeviceMotionEvent) => {
      const accel = e.accelerationIncludingGravity;

      if (!accel) return;

      const x = accel.x ?? 0;
      const y = accel.y ?? 0;

      if (!baseline) {
        // 初期のスマホの傾きを考慮
        baseline = { x, y };
        return;
      }

      // 持ち方の変化に緩やかに追従させる
      baseline.x += (x - baseline.x) * BASELINE_FOLLOW;
      baseline.y += (y - baseline.y) * BASELINE_FOLLOW;

      motionRef.current = {
        x: applyDeadZone(x - baseline.x),
        y: applyDeadZone(-y + baseline.y),
      };
    };

    window.addEventListener("devicemotion", handler);

    return () => window.removeEventListener("devicemotion", handler);
  }, [permissionGranted]);

  return { motionRef, permissionGranted, requestPermission };
};
