"use client";

import { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import gsap from "gsap";
import StatBlock from "@/components/ui/StatBlock";
import ScoreRing from "@/components/ui/ScoreRing";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import type { BuildStatsResult } from "@/lib/tuning/types";
import { prefersReducedMotion } from "@/lib/gsap/gsapUtils";
import { revoraColors } from "@/theme/colors";

type BuildStatsProps = {
  stats: BuildStatsResult;
  compact?: boolean;
};

export default function BuildStats({ stats, compact = false }: BuildStatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const perf = stats.calculatedPerformance;

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.fromTo(ref.current, { opacity: 0.85 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
  }, [perf.horsepower, perf.torque, stats.buildScore]);

  return (
    <Box
      ref={ref}
      sx={{
        p: compact ? 2 : 3,
        border: `1px solid ${revoraColors.border}`,
        bgcolor: revoraColors.paper,
        borderRadius: 1,
      }}
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={6}>
          <StatBlock label="Horsepower" value={perf.horsepower} unit="HP" animate />
        </Grid>
        <Grid size={6}>
          <StatBlock label="Torque" value={perf.torque} unit="Nm" animate />
        </Grid>
        <Grid size={6}>
          <StatBlock label="0–100" value={perf.zeroToHundred} unit="s" animate />
        </Grid>
        <Grid size={6}>
          <StatBlock label="Top speed" value={perf.topSpeed} unit="km/h" animate />
        </Grid>
        {!compact ? (
          <>
            <Grid size={6}>
              <StatBlock label="Weight" value={perf.weight} unit="kg" animate />
            </Grid>
            <Grid size={6}>
              <StatBlock label="Downforce" value={perf.downforce || 0} unit="" animate />
            </Grid>
          </>
        ) : null}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
        <ScoreRing label="Power" value={stats.scores.performance} size={compact ? 64 : 72} animate />
        <ScoreRing label="Handle" value={stats.scores.handling} size={compact ? 64 : 72} animate />
        <ScoreRing label="Brake" value={stats.scores.braking} size={compact ? 64 : 72} animate />
        {!compact ? (
          <>
            <ScoreRing label="Aero" value={stats.scores.aero || 0} size={72} animate />
            <ScoreRing label="Style" value={stats.scores.style} size={72} animate />
          </>
        ) : null}
      </Box>
      <Box sx={{ mt: 2, display: "flex", alignItems: "baseline", gap: 1 }}>
        <AnimatedCounter value={stats.buildScore} fontSize={compact ? 32 : 42} color="primary.main" />
        <Typography variant="caption" color="text.secondary">
          BUILD SCORE
        </Typography>
      </Box>
    </Box>
  );
}
