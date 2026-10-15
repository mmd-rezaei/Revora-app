"use client";

import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import type { CameraPreset, StudioMode } from "@/lib/tuning/types";
import { revoraColors } from "@/theme/colors";

type TuningToolbarProps = {
  studioMode: StudioMode;
  cameraPreset: CameraPreset;
  onModeChange: (mode: StudioMode) => void;
  onCameraChange: (preset: CameraPreset) => void;
};

const MODES: { value: StudioMode; label: string }[] = [
  { value: "build", label: "Build" },
  { value: "inspect", label: "Inspect" },
  { value: "drive", label: "Drive" },
];

const CAMERAS: { value: CameraPreset; label: string }[] = [
  { value: "orbit", label: "Orbit" },
  { value: "front", label: "Front" },
  { value: "rear", label: "Rear" },
  { value: "side", label: "Side" },
  { value: "top", label: "Top" },
  { value: "interior", label: "Interior" },
];

export default function TuningToolbar({
  studioMode,
  cameraPreset,
  onModeChange,
  onCameraChange,
}: TuningToolbarProps) {
  return (
    <Box
      className="tuning-toolbar"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary">
          REVORA TUNING STUDIO
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={studioMode}
          onChange={(_, v: StudioMode | null) => v && onModeChange(v)}
          aria-label="Studio mode"
        >
          {MODES.map((m) => (
            <ToggleButton key={m.value} value={m.value} aria-label={m.label}>
              {m.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      {studioMode !== "drive" ? (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={cameraPreset}
          onChange={(_, v: CameraPreset | null) => v && onCameraChange(v)}
          aria-label="Camera view"
          sx={{ flexWrap: "wrap" }}
        >
          {CAMERAS.map((c) => (
            <ToggleButton key={c.value} value={c.value} sx={{ borderColor: revoraColors.border }}>
              {c.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ) : null}
    </Box>
  );
}
