"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { Color } from "three";
import type { BuildConfig } from "@/types";
import { finishMetalness, finishRoughness, resolvePaintHex } from "@/lib/tuning/paintPresets";
import type { PaintFinish } from "@/lib/tuning/types";

type GlbCarModelProps = {
  modelPath: string;
  config: BuildConfig;
  driveSpin?: boolean;
  scale?: number;
};

const GLASS_HINT = /glass|window|windshield|light|lamp|chrome|rim|tire|wheel|interior|seat/i;
const BODY_HINT = /body|paint|car|chassis|hood|door|bumper|metal|shell|base|main/i;

function isPaintableMesh(name: string, materialName: string): boolean {
  const label = `${name} ${materialName}`;
  if (GLASS_HINT.test(label)) return false;
  if (BODY_HINT.test(label)) return true;
  // Default: paint opaque body-like meshes, skip very dark glass-like
  return !/transparent|transmission|clearcoat/i.test(label);
}

export default function GlbCarModel({
  modelPath,
  config,
  driveSpin = false,
  scale = 1,
}: GlbCarModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);

  const paintHex = resolvePaintHex(
    config.exterior.paintColor || "Alpine White",
    config.exterior.customPaintHex,
  );
  const paintFinish = (config.exterior.paintFinish || "gloss") as PaintFinish;

  const cloned = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((child) => {
      if (!(child as Mesh).isMesh) return;
      const mesh = child as Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat, index) => {
        if (!mat || typeof mat !== "object") return;
        const std = mat as MeshStandardMaterial;
        const matName = typeof std.name === "string" ? std.name : "";
        if (!isPaintableMesh(mesh.name, matName)) return;

        const painted = std.clone();
        painted.color = new Color(paintHex);
        painted.metalness = finishMetalness(paintFinish);
        painted.roughness = finishRoughness(paintFinish);
        if (Array.isArray(mesh.material)) {
          mesh.material[index] = painted;
        } else {
          mesh.material = painted;
        }
      });
    });
    return root;
  }, [scene, paintHex, paintFinish]);

  useEffect(() => {
    return () => {
      cloned.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose?.());
          } else {
            mesh.material?.dispose?.();
          }
        }
      });
    };
  }, [cloned]);

  useFrame((_, delta) => {
    if (driveSpin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={scale}>
      <Center disableY>
        <primitive object={cloned} rotation={[0, Math.PI, 0]} />
      </Center>
    </group>
  );
}

useGLTF.preload("/models/cars/sedan.glb");
useGLTF.preload("/models/cars/suv.glb");
useGLTF.preload("/models/cars/pickup.glb");
