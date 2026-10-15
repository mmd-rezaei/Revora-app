"use client";

import { useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { CameraPreset } from "@/lib/tuning/types";
import { prefersReducedMotion } from "@/lib/gsap/gsapUtils";

const PRESETS: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  orbit: { position: [4.5, 2.2, 5.5], target: [0, 0.6, 0] },
  front: { position: [0, 1.1, 6.2], target: [0, 0.7, 0] },
  rear: { position: [0, 1.1, -6.2], target: [0, 0.7, 0] },
  side: { position: [6.5, 1.4, 0], target: [0, 0.6, 0] },
  top: { position: [0.01, 9, 0.01], target: [0, 0, 0] },
  interior: { position: [0.15, 1.05, 0.85], target: [0, 0.95, -1.2] },
};

type CameraControllerProps = {
  preset: CameraPreset;
  enabled: boolean;
  autoRotate?: boolean;
};

export default function CameraController({ preset, enabled, autoRotate = false }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const cfg = PRESETS[preset];
    if (!cfg) return;

    tweenRef.current?.kill();
    if (prefersReducedMotion()) {
      camera.position.set(...cfg.position);
      controlsRef.current?.target.set(...cfg.target);
      controlsRef.current?.update();
      return;
    }

    tweenRef.current = gsap.to(camera.position, {
      x: cfg.position[0],
      y: cfg.position[1],
      z: cfg.position[2],
      duration: 1.1,
      ease: "power3.inOut",
      onUpdate: () => controlsRef.current?.update(),
    });

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: cfg.target[0],
        y: cfg.target[1],
        z: cfg.target[2],
        duration: 1.1,
        ease: "power3.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
    }
  }, [preset, camera]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={42} near={0.1} far={100} />
      <OrbitControls
        ref={controlsRef}
        enabled={enabled}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enablePan={false}
        minDistance={2.5}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.05}
        target={PRESETS[preset].target}
      />
    </>
  );
}
