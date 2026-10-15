"use client";

import { use } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";
import PageReveal from "@/components/ui/PageReveal";
import RevoraButton from "@/components/ui/RevoraButton";
import BuildStats from "@/components/tuning/BuildStats";
import BuildSummary from "@/components/tuning/BuildSummary";
import { fetchBuild } from "@/lib/api/builds";
import { fetchTuningParts } from "@/lib/api/builds";
import { calculateBuildStats } from "@/lib/tuning/calculateBuildStats";
import { defaultVehicleConfig } from "@/config/tuningOptions";
import type { Car } from "@/types";
import { revoraColors } from "@/theme/colors";

function ShareContent({ buildId }: { buildId: string }) {
  const { data: build, isLoading, isError } = useQuery({
    queryKey: ["build", buildId],
    queryFn: () => fetchBuild(buildId),
  });
  const { data: parts = [] } = useQuery({ queryKey: ["tuning-parts"], queryFn: fetchTuningParts });

  if (isLoading) return <PageLoader />;
  if (isError || !build) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Build not found or you do not have access.</Alert>
      </Container>
    );
  }

  const car = typeof build.carId === "object" ? (build.carId as Car) : null;
  if (!car) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="warning">Car data unavailable for this build.</Alert>
      </Container>
    );
  }

  const partIds = (build.installedParts as { id: string }[]).map((p) => (typeof p === "string" ? p : p.id));
  const stats = calculateBuildStats({
    car,
    parts,
    installedPartIds: partIds,
    config: build.config,
    vehicleConfig: defaultVehicleConfig,
    serverPerformance: build.calculatedPerformance,
    serverScores: build.scores,
  });

  return (
    <PageReveal>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="overline" color="text.secondary">
          Shared Build
        </Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {build.name}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {car.brandName} {car.modelName} {car.trim}
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={car.images[0] || ""}
              alt={`${car.brandName} ${car.modelName}`}
              sx={{ width: "100%", borderRadius: 1, border: `1px solid ${revoraColors.border}` }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <BuildStats stats={stats} compact />
          </Grid>
          <Grid size={12}>
            <BuildSummary car={car} buildName={build.name} config={build.config} stats={stats} />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <RevoraButton component={Link} href={`/tune/${car.id}?build=${build.id}`} variant="contained">
            Edit in Studio
          </RevoraButton>
          <RevoraButton component={Link} href="/garage">
            Back to Garage
          </RevoraButton>
        </Box>
      </Container>
    </PageReveal>
  );
}

export default function BuildSharePage({ params }: { params: Promise<{ buildId: string }> }) {
  const { buildId } = use(params);
  return (
    <ProtectedRoute>
      <ShareContent buildId={buildId} />
    </ProtectedRoute>
  );
}
