"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { specFont } from "@/theme/revoraTheme";

type Props = {
  label: string;
  value: number;
  size?: number;
};

export default function ScoreRing({ label, value, size = 96 }: Props) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(244,241,234,0.08)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E11D2E"
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <Typography
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontFamily: specFont,
            fontSize: size > 80 ? 22 : 16,
            fontWeight: 700,
          }}
        >
          {Math.round(value)}
        </Typography>
      </Box>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
