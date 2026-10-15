"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import type { BuildConfig } from "@/types";
import { finishMetalness, finishRoughness, resolvePaintHex } from "@/lib/tuning/paintPresets";
import type { PaintFinish } from "@/lib/tuning/types";

type ProceduralCarMeshProps = {
  config: BuildConfig;
  driveSpin?: boolean;
};

function wheelRadius(size: string): number {
  const n = parseInt(size.replace(/[^\d]/g, ""), 10);
  return 0.28 + (n - 18) * 0.018;
}

/** Block placeholder when no photo or GLB is available. */
export default function ProceduralCarMesh({ config, driveSpin = false }: ProceduralCarMeshProps) {
  const groupRef = useRef<Group>(null);
  const paintFinish = (config.exterior.paintFinish || "gloss") as PaintFinish;
  const paintHex = resolvePaintHex(
    config.exterior.paintColor || "Alpine White",
    config.exterior.customPaintHex,
  );
  const wheelR = wheelRadius(config.wheels.size || '19"');
  const hasSpoiler = config.exterior.spoiler !== "None";
  const hasWidebody = config.exterior.bodyKit === "Widebody";
  const bodyWidth = hasWidebody ? 1.05 : 0.92;

  const bodyMaterial = useMemo(
    () => ({
      color: paintHex,
      metalness: finishMetalness(paintFinish),
      roughness: finishRoughness(paintFinish),
    }),
    [paintHex, paintFinish],
  );

  useFrame((_, delta) => {
    if (driveSpin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      <RoundedBox args={[bodyWidth * 2, 0.55, 3.8]} radius={0.08} smoothness={4} castShadow receiveShadow position={[0, 0.55, 0]}>
        <meshStandardMaterial {...bodyMaterial} />
      </RoundedBox>
      <RoundedBox args={[bodyWidth * 1.7, 0.5, 1.8]} radius={0.12} smoothness={4} castShadow position={[0, 1.05, -0.15]}>
        <meshStandardMaterial color="#111820" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      {hasSpoiler ? (
        <mesh position={[0, 0.95, -1.85]}>
          <boxGeometry args={[1.1, 0.06, 0.25]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.7} roughness={0.25} />
        </mesh>
      ) : null}
      {([
        [-0.95, 0.28, 1.2],
        [0.95, 0.28, 1.2],
        [-0.95, 0.28, -1.2],
        [0.95, 0.28, -1.2],
      ] as const).map(([x, y, z], i) => (
        <group key={i} position={[x * (hasWidebody ? 1.08 : 1), y, z]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[wheelR, wheelR, 0.22, 24]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
