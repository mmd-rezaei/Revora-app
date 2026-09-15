"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { specFont } from "@/theme/revoraTheme";

type Props = {
  label: string;
  value: string | number;
  unit?: string;
  align?: "left" | "center";
};

export default function StatBlock({ label, value, unit, align = "left" }: Props) {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: specFont, fontSize: { xs: 22, md: 28 }, fontWeight: 600, lineHeight: 1 }}>
        {value}
        {unit ? (
          <Box component="span" sx={{ ml: 0.75, fontSize: 12, color: "text.secondary", fontWeight: 400 }}>
            {unit}
          </Box>
        ) : null}
      </Typography>
    </Box>
  );
}
