"use client";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import type { VehicleConfiguration } from "@/lib/tuning/types";
import { vehicleConfigurationOptions } from "@/config/tuningOptions";

type ConfigurationPanelProps = {
  vehicleConfig: VehicleConfiguration;
  onChange: (key: keyof VehicleConfiguration, value: string) => void;
};

export default function ConfigurationPanel({ vehicleConfig, onChange }: ConfigurationPanelProps) {
  return (
    <Box className="tuning-panel" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="overline">Vehicle Configuration</Typography>
      {(Object.keys(vehicleConfigurationOptions) as (keyof VehicleConfiguration)[]).map((key) => (
        <FormControl key={key} fullWidth size="small">
          <InputLabel id={`vehicle-${key}`}>{key}</InputLabel>
          <Select
            labelId={`vehicle-${key}`}
            label={key}
            value={vehicleConfig[key]}
            onChange={(e) => onChange(key, e.target.value)}
          >
            {vehicleConfigurationOptions[key].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}
