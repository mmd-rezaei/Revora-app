"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CarCard from "@/components/ui/CarCard";
import ScoreRing from "@/components/ui/ScoreRing";
import EmptyState from "@/components/ui/EmptyState";
import PageLoader from "@/components/ui/PageLoader";
import RevoraButton from "@/components/ui/RevoraButton";
import { deleteBuild, fetchBuilds, fetchFavorites, removeFavorite } from "@/lib/api/builds";
import type { Car } from "@/types";

function GarageContent() {
  const [tab, setTab] = useState(0);
  const queryClient = useQueryClient();
  const { data: builds = [], isLoading: loadingBuilds } = useQuery({ queryKey: ["builds"], queryFn: fetchBuilds });
  const { data: favorites = [], isLoading: loadingFavs } = useQuery({ queryKey: ["favorites"], queryFn: fetchFavorites });

  const deleteMutation = useMutation({
    mutationFn: deleteBuild,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["builds"] }),
  });
  const unfavMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 3 }}>My Garage</Typography>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 4 }}>
        <Tab label={`Builds (${builds.length})`} />
        <Tab label={`Favorites (${favorites.length})`} />
      </Tabs>
      {tab === 0 ? (
        loadingBuilds ? (
          <PageLoader />
        ) : builds.length === 0 ? (
          <EmptyState title="No builds yet" body="Configure and tune a car, then save it here." />
        ) : (
          <Grid container spacing={3}>
            {builds.map((build) => {
              const car = typeof build.carId === "object" ? build.carId : null;
              return (
                <Grid key={build.id} size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 3, border: "1px solid rgba(244,241,234,0.08)", bgcolor: "#0E0E11", height: "100%" }}>
                    <Typography variant="overline">{car ? `${car.brandName} ${car.modelName}` : "Car"}</Typography>
                    <Typography variant="h5">{build.name}</Typography>
                    <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                      <ScoreRing label="Overall" value={build.scores?.overall || 0} size={72} />
                      <Box>
                        <Typography color="text.secondary">{build.calculatedPerformance?.horsepower} HP</Typography>
                        <Typography color="text.secondary">{build.calculatedPerformance?.zeroToHundred}s 0–100</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {car ? (
                        <RevoraButton component={Link} href={`/tune/${car.id}`} size="small" variant="contained">
                          Continue tuning
                        </RevoraButton>
                      ) : null}
                      <RevoraButton size="small" onClick={() => deleteMutation.mutate(build.id)}>
                        Delete
                      </RevoraButton>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )
      ) : loadingFavs ? (
        <PageLoader />
      ) : favorites.length === 0 ? (
        <EmptyState title="No favorites" body="Save cars from a detail page to keep them here." />
      ) : (
        <Grid container spacing={3}>
          {favorites.map((favorite) => (
            <Grid key={favorite.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CarCard car={favorite.car as Car} />
              <RevoraButton size="small" onClick={() => unfavMutation.mutate(favorite.id)} sx={{ mt: 1 }}>
                Remove
              </RevoraButton>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default function GaragePage() {
  return (
    <ProtectedRoute>
      <GarageContent />
    </ProtectedRoute>
  );
}
