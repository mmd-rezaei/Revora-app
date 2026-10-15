"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { PAINT_PRESETS } from "@/lib/tuning/paintPresets";
import type { BuildConfig } from "@/types";
import { revoraColors } from "@/theme/colors";

type PaintSelectorProps = {
  config: BuildConfig;
  onChange: (key: string, value: string) => void;
};

export default function PaintSelector({ config, onChange }: PaintSelectorProps) {
  const ext = config.exterior;

  return (
    <Box className="tuning-panel" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="overline">Paint Studio</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 1 }}>
        {PAINT_PRESETS.map((preset) => (
          <Box
            key={preset.id}
            component="button"
            type="button"
            aria-label={`Paint ${preset.name}`}
            onClick={() => {
              onChange("paintColor", preset.name);
              onChange("paintFinish", preset.finish);
              onChange("customPaintHex", preset.hex);
            }}
            sx={{
              border:
                ext.paintColor === preset.name
                  ? `2px solid ${revoraColors.signal}`
                  : `1px solid ${revoraColors.border}`,
              borderRadius: 1,
              p: 0.5,
              cursor: "pointer",
              bgcolor: "transparent",
            }}
          >
            <Box sx={{ height: 36, borderRadius: 0.5, bgcolor: preset.hex, mb: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: 9, lineHeight: 1.2 }}>
              {preset.name}
            </Typography>
          </Box>
        ))}
      </Box>
      <FormControl fullWidth size="small">
        <InputLabel id="paint-finish-label">Finish</InputLabel>
        <Select
          labelId="paint-finish-label"
          label="Finish"
          value={ext.paintFinish || "gloss"}
          onChange={(e) => onChange("paintFinish", e.target.value)}
        >
          {["gloss", "matte", "metallic", "pearl"].map((f) => (
            <MenuItem key={f} value={f}>
              {f}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        label="Custom hex"
        placeholder="#FFFFFF"
        value={ext.customPaintHex || ""}
        onChange={(e) => onChange("customPaintHex", e.target.value)}
        slotProps={{ htmlInput: { maxLength: 7 } }}
      />
    </Box>
  );
}
