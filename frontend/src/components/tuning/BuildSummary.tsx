"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import type { Car } from "@/types";
import type { BuildStatsResult } from "@/lib/tuning/types";
import type { BuildConfig } from "@/types";
import { revoraColors } from "@/theme/colors";

type BuildSummaryProps = {
  car: Car;
  buildName: string;
  config: BuildConfig;
  stats: BuildStatsResult;
};

function highlightItems(config: BuildConfig): string[] {
  const items: string[] = [];
  const ext = config.exterior;
  const wh = config.wheels;
  const int = config.interior;
  if (ext.bodyKit && ext.bodyKit !== "Stock") items.push(ext.bodyKit);
  if (ext.spoiler && ext.spoiler !== "None") items.push(ext.spoiler);
  if (wh.size) items.push(`${wh.size} Wheels`);
  if (wh.tireType && wh.tireType !== "All-Season") items.push(wh.tireType);
  if (int.seats && int.seats !== "OEM" && int.seats !== "Standard") items.push(`${int.seats} Interior`);
  if (int.trim && !["Aluminum", "Standard"].includes(int.trim)) items.push(int.trim);
  return items.slice(0, 6);
}

export default function BuildSummary({ car, buildName, config, stats }: BuildSummaryProps) {
  const highlights = highlightItems(config);
  const perf = stats.calculatedPerformance;

  return (
    <Box
      className="build-summary"
      sx={{
        p: 2.5,
        border: `1px solid ${revoraColors.border}`,
        bgcolor: revoraColors.elevated,
        borderRadius: 1,
      }}
    >
      <Typography variant="overline" color="text.secondary">
        Live Build Summary
      </Typography>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {buildName}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {car.brandName} {car.modelName} {car.trim}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 2 }}>
        <Typography variant="body2">{perf.horsepower} HP</Typography>
        <Typography variant="body2">{perf.torque} Nm</Typography>
        <Typography variant="body2">{perf.zeroToHundred}s 0–100</Typography>
        <Typography variant="body2">{perf.topSpeed} km/h</Typography>
      </Box>
      {highlights.length ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
          {highlights.map((item) => (
            <Box
              key={item}
              component="span"
              sx={{
                px: 1,
                py: 0.25,
                fontSize: 11,
                border: `1px solid ${revoraColors.border}`,
                borderRadius: 0.5,
                color: "text.secondary",
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      ) : null}
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Warnings: {stats.warnings.length} · Recommendations: {stats.recommendations.length}
      </Typography>
      {stats.warnings.slice(0, 2).map((w) => (
        <Alert key={w.title} severity="warning" sx={{ mb: 1, py: 0 }}>
          <Typography variant="caption">{w.title}: {w.message}</Typography>
        </Alert>
      ))}
      {stats.recommendations.slice(0, 1).map((r) => (
        <Alert key={r.title} severity="info" sx={{ py: 0 }}>
          <Typography variant="caption">{r.title}: {r.message}</Typography>
        </Alert>
      ))}
    </Box>
  );
}
