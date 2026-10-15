"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Grid } from "@react-three/drei";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { BuildConfig } from "@/types";
import type { CameraPreset, StudioMode } from "@/lib/tuning/types";
import { revoraColors } from "@/theme/colors";
import CarModel from "./CarModel";
import CameraController from "./CameraController";

type CarSceneProps = {
  config: BuildConfig;
  cameraPreset: CameraPreset;
  studioMode: StudioMode;
  modelPath?: string;
  modelScale?: number;
  isGenericModel?: boolean;
  carLabel: string;
};

function SceneFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={revoraColors.signal} wireframe />
    </mesh>
  );
}

export default function CarScene({
  config,
  cameraPreset,
  studioMode,
  modelPath,
  modelScale = 1,
  isGenericModel = false,
  carLabel,
}: CarSceneProps) {
  const inspect = studioMode === "inspect";
  const drive = studioMode === "drive";

  return (
    <Box
      className="tuning-scene"
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 280, sm: 360, md: "min(52vh, 520px)" },
        borderRadius: 1,
        overflow: "hidden",
        border: `1px solid ${revoraColors.border}`,
        bgcolor: revoraColors.bgDeep,
      }}
      aria-label={`3D viewer for ${carLabel}`}
    >
      {isGenericModel ? (
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            px: 1,
            py: 0.5,
            bgcolor: "rgba(12,24,41,0.75)",
            border: `1px solid ${revoraColors.border}`,
            borderRadius: 0.5,
          }}
        >
          3D mesh by body type — exact {carLabel} model can be added later
        </Typography>
      ) : null}
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={[revoraColors.bgDeep]} />
        <fog attach="fog" args={[revoraColors.bgDeep, 8, 22]} />
        <ambientLight intensity={0.35} />
        <directionalLight castShadow position={[5, 8, 4]} intensity={1.2} shadow-mapSize={[1024, 1024]} />
        <spotLight position={[-4, 6, -2]} intensity={0.45} angle={0.4} penumbra={0.5} />
        <Suspense fallback={<SceneFallback />}>
          <Environment preset="city" />
          <CarModel
            config={config}
            driveSpin={drive}
            modelPath={modelPath}
            modelScale={modelScale}
          />
          <ContactShadows position={[0, -0.35, 0]} opacity={0.55} scale={12} blur={2.5} />
          <Grid
            position={[0, -0.36, 0]}
            args={[14, 14]}
            cellSize={0.5}
            cellColor={revoraColors.border}
            sectionColor={revoraColors.borderHover}
            fadeDistance={16}
            infiniteGrid
          />
        </Suspense>
        <CameraController
          preset={cameraPreset}
          enabled={!drive}
          autoRotate={drive || inspect}
        />
      </Canvas>
    </Box>
  );
}
