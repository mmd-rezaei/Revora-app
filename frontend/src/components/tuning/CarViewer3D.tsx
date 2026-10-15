"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import type { BuildConfig } from "@/types";
import type { CameraPreset, StudioMode } from "@/lib/tuning/types";
import { revoraColors } from "@/theme/colors";

const CarScene = dynamic(() => import("./CarScene"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: { xs: 280, sm: 360, md: "min(52vh, 520px)" },
        display: "grid",
        placeItems: "center",
        border: `1px solid ${revoraColors.border}`,
        bgcolor: revoraColors.bgDeep,
        borderRadius: 1,
      }}
    >
      <CircularProgress size={32} color="primary" aria-label="Loading 3D viewer" />
    </Box>
  ),
});

type CarViewer3DProps = {
  config: BuildConfig;
  cameraPreset: CameraPreset;
  studioMode: StudioMode;
  modelPath?: string;
  modelScale?: number;
  isGenericModel?: boolean;
  carLabel: string;
};

export default function CarViewer3D(props: CarViewer3DProps) {
  return <CarScene {...props} />;
}
