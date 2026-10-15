"use client";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

type Field = { key: string; label: string; options: readonly string[] };

type OptionSelectPanelProps = {
  title: string;
  group: "exterior" | "wheels" | "interior";
  fields: readonly Field[];
  values: Record<string, string>;
  onChange: (group: "exterior" | "wheels" | "interior", key: string, value: string) => void;
};

export default function OptionSelectPanel({
  title,
  group,
  fields,
  values,
  onChange,
}: OptionSelectPanelProps) {
  return (
    <Box className="tuning-panel" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="overline">{title}</Typography>
      {fields.map((field) => (
        <FormControl key={field.key} fullWidth size="small">
          <InputLabel id={`${group}-${field.key}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${group}-${field.key}-label`}
            label={field.label}
            value={values[field.key] || field.options[0]}
            onChange={(e) => onChange(group, field.key, e.target.value)}
          >
            {field.options.map((opt) => (
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
