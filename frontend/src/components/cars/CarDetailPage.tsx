"use client";

import { use } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageLoader from "@/components/ui/PageLoader";
import StatBlock from "@/components/ui/StatBlock";
import RevoraButton from "@/components/ui/RevoraButton";
import PageReveal from "@/components/ui/PageReveal";
import { fetchCar } from "@/lib/api/cars";
import { addFavorite, fetchFavorites, removeFavorite } from "@/lib/api/builds";
import { useCompareStore } from "@/store/compareStore";
import { useAuthStore } from "@/store/authStore";
import { specFont } from "@/theme/revoraTheme";

export default function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { addCar, hasCar } = useCompareStore();
  const { data: car, isLoading } = useQuery({ queryKey: ["car", slug], queryFn: () => fetchCar(slug) });
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: Boolean(user),
  });

  const favorite = car ? favorites.find((item) => item.car.id === car.id) : undefined;

  const favMutation = useMutation({
    mutationFn: async () => {
      if (!car) return;
      if (favorite) await removeFavorite(favorite.id);
      else await addFavorite(car.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  if (isLoading || !car) return <PageLoader />;

  return (
    <PageReveal>
      <Box sx={{ position: "relative", height: { xs: 320, md: 560 } }}>
        <Image src={car.images[0] || "/next.svg"} alt={`${car.brandName} ${car.modelName}`} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #050506 8%, transparent 55%)" }} />
        <Container maxWidth="lg" sx={{ position: "absolute", bottom: 32, left: 0, right: 0 }}>
          <Typography variant="overline">{car.brandName} · {car.generationName} · {car.year}</Typography>
          <Typography variant="h2">{car.modelName} {car.trim}</Typography>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 6, md: 3 }}><StatBlock label="Horsepower" value={car.horsepower} unit="HP" /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><StatBlock label="Torque" value={car.torque} unit="Nm" /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><StatBlock label="0–100" value={car.zeroToHundred} unit="s" /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><StatBlock label="Top speed" value={car.topSpeed} unit="km/h" /></Grid>
        </Grid>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 6 }}>
          <RevoraButton component={Link} href={`/configure/${car.id}`} variant="contained">Configure</RevoraButton>
          <RevoraButton component={Link} href={`/tune/${car.id}`} variant="outlined">Tune</RevoraButton>
          <RevoraButton variant="outlined" onClick={() => addCar(car)} disabled={hasCar(car.id)}>
            {hasCar(car.id) ? "In compare" : "Compare"}
          </RevoraButton>
          <RevoraButton variant="outlined" onClick={() => favMutation.mutate()} disabled={!user}>
            {favorite ? "In garage" : "Add to garage"}
          </RevoraButton>
        </Box>
        <Typography color="text.secondary" sx={{ maxWidth: 760, mb: 4, fontSize: 18, lineHeight: 1.7 }}>
          {car.description}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            ["Engine", car.engine],
            ["Transmission", car.transmission],
            ["Drive", car.driveType],
            ["Fuel", car.fuelType],
            ["Weight", `${car.weight} kg`],
            ["Body", car.bodyType],
          ].map(([label, value]) => (
            <Grid key={label} size={{ xs: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography sx={{ fontFamily: specFont }}>{value}</Typography>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {car.features.map((feature) => (
            <Chip key={feature} label={feature} />
          ))}
        </Box>
      </Container>
    </PageReveal>
  );
}
