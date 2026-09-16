"use client";

import { use, useCallback, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import RevoraButton from "@/components/ui/RevoraButton";
import StatBlock from "@/components/ui/StatBlock";
import ScoreRing from "@/components/ui/ScoreRing";
import PageLoader from "@/components/ui/PageLoader";
import PageReveal from "@/components/ui/PageReveal";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { fetchCar } from "@/lib/api/cars";
import { createBuild, fetchTuningParts, previewPerformance } from "@/lib/api/builds";
import { useBuildStore } from "@/store/buildStore";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { flashStats, pulseElement } from "@/lib/gsap/presets";
import { specFont } from "@/theme/revoraTheme";
import { revoraColors } from "@/theme/colors";

function TuningStudioContent({ carId }: { carId: string }) {
  const router = useRouter();
  const statsRef = useRef<HTMLDivElement>(null);
  const scoresRef = useRef<HTMLDivElement>(null);
  const overallRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<HTMLDivElement>(null);
  const {
    buildName,
    setBuildName,
    installedParts,
    togglePart,
    config,
    performance,
    scores,
    setPerformance,
  } = useBuildStore();

  const { data: car, isLoading } = useQuery({ queryKey: ["car", carId], queryFn: () => fetchCar(carId) });
  const { data: parts = [] } = useQuery({ queryKey: ["tuning-parts"], queryFn: fetchTuningParts });

  const updatePreview = useCallback(async () => {
    const result = await previewPerformance({ carId, installedParts, config });
    setPerformance(result.calculatedPerformance, result.scores);
  }, [carId, installedParts, config, setPerformance]);

  useEffect(() => {
    updatePreview().catch(() => undefined);
  }, [updatePreview]);

  useEffect(() => {
    if (!partsRef.current || prefersReducedMotion()) return;
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(".tune-category", { x: -30, opacity: 0, duration: 0.65, stagger: 0.12, ease: "power3.out" });
    }, partsRef);
    return () => ctx.revert();
  }, [car, parts.length]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (statsRef.current) flashStats(statsRef.current);
    if (scoresRef.current) pulseElement(scoresRef.current, 1.03);
    if (overallRef.current) pulseElement(overallRef.current, 1.06);
  }, [performance, scores]);

  const saveMutation = useMutation({
    mutationFn: () => createBuild({ carId, name: buildName, installedParts, config }),
    onSuccess: () => router.push("/garage"),
  });

  const handleTogglePart = (partId: string, exclusiveGroup: string | undefined) => {
    togglePart(partId, exclusiveGroup, parts);
    if (!prefersReducedMotion()) {
      const chip = document.querySelector(`[data-part-id="${partId}"]`);
      if (chip instanceof HTMLElement) pulseElement(chip, 1.08);
    }
  };

  if (isLoading || !car) return <PageLoader />;

  const categories = [...new Set(parts.map((part) => part.category))];
  const perf = performance || {
    horsepower: car.horsepower,
    torque: car.torque,
    zeroToHundred: car.zeroToHundred,
    topSpeed: car.topSpeed,
    weight: car.weight,
    handling: 68,
    braking: 68,
    reliability: 86,
  };

  return (
    <PageReveal>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 4 }} className="page-child">
          <Box>
            <Typography variant="h3">Tuning Studio</Typography>
            <Typography color="text.secondary">
              {car.brandName} {car.modelName} {car.trim}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField label="Build name" value={buildName} onChange={(e) => setBuildName(e.target.value)} />
            <RevoraButton variant="contained" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || buildName.length < 2}>
              Save to garage
            </RevoraButton>
          </Box>
        </Box>

        {saveMutation.isError ? <Alert severity="error" sx={{ mb: 2 }} className="page-child">Could not save this build. Sign in and try again.</Alert> : null}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }} ref={partsRef}>
            {categories.map((category) => (
              <Box key={category} className="tune-category page-child" sx={{ mb: 3 }}>
                <Typography variant="overline">{category}</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {parts.filter((part) => part.category === category).map((part) => {
                    const active = installedParts.includes(part.id);
                    return (
                      <Chip
                        key={part.id}
                        data-part-id={part.id}
                        label={`${part.name}  ${part.effects.horsepower ? `+${part.effects.horsepower} HP` : part.tier}`}
                        onClick={() => handleTogglePart(part.id, part.exclusiveGroup ?? undefined)}
                        color={active ? "primary" : "default"}
                        variant={active ? "filled" : "outlined"}
                        sx={{ fontFamily: specFont }}
                      />
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              ref={statsRef}
              sx={{
                p: 3,
                border: `1px solid ${revoraColors.border}`,
                bgcolor: revoraColors.paper,
                borderRadius: 1,
                position: { md: "sticky" },
                top: "calc(var(--navbar-height) + 16px)",
              }}
              className="page-child"
            >
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={6}><StatBlock label="Horsepower" value={perf.horsepower} unit="HP" animate /></Grid>
                <Grid size={6}><StatBlock label="Torque" value={perf.torque} unit="Nm" animate /></Grid>
                <Grid size={6}><StatBlock label="0–100" value={perf.zeroToHundred} unit="s" animate /></Grid>
                <Grid size={6}><StatBlock label="Top speed" value={perf.topSpeed} unit="km/h" animate /></Grid>
              </Grid>
              <Box ref={scoresRef} sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                <ScoreRing label="Perf" value={scores?.performance || 0} size={78} animate />
                <ScoreRing label="Handle" value={scores?.handling || 0} size={78} animate />
                <ScoreRing label="Brake" value={scores?.braking || 0} size={78} animate />
                <ScoreRing label="Style" value={scores?.style || 0} size={78} animate />
              </Box>
              <Box ref={overallRef} sx={{ mt: 2 }}>
                <AnimatedCounter value={scores?.overall || 0} fontSize={42} color="primary.main" />
                <Box component="span" sx={{ fontSize: 14, color: "text.secondary", ml: 1 }}>OVERALL</Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </PageReveal>
  );
}

export default function TunePage({ params }: { params: Promise<{ carId: string }> }) {
  const { carId } = use(params);
  return (
    <ProtectedRoute>
      <TuningStudioContent carId={carId} />
    </ProtectedRoute>
  );
}
