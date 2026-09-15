"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeader({ eyebrow = "REVORA", title, subtitle, align = "left" }: Props) {
  return (
    <Box sx={{ textAlign: align, mb: 4 }}>
      <Typography variant="overline" sx={{ color: "primary.main", display: "block", mb: 1 }}>
        {eyebrow}
      </Typography>
      <Typography variant="h3" sx={{ mb: subtitle ? 1 : 0 }}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography color="text.secondary" sx={{ maxWidth: align === "center" ? 560 : 480, mx: align === "center" ? "auto" : 0 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
