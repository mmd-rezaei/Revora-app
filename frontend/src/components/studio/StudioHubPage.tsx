"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import CarCard from "@/components/ui/CarCard";
import SectionHeader from "@/components/ui/SectionHeader";
import PageLoader from "@/components/ui/PageLoader";
import PageReveal from "@/components/ui/PageReveal";
import RevoraButton from "@/components/ui/RevoraButton";
import { fetchCars } from "@/lib/api/cars";
import { useStaggerReveal } from "@/hooks/useScrollReveal";

type Props = {
  title: string;
  subtitle: string;
  actionPath: "configure" | "tune";
  emptyHint: string;
};

export default function StudioHubPage({ title, subtitle, actionPath, emptyHint }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["cars", actionPath, "hub"],
    queryFn: () => fetchCars({ sort: "horsepower", limit: 12 }),
  });
  const gridRef = useStaggerReveal([data?.items.length]);

  if (isLoading) return <PageLoader />;

  const cars = data?.items ?? [];

  return (
    <PageReveal>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box className="page-child">
          <SectionHeader title={title} subtitle={subtitle} />
        </Box>

        {cars.length === 0 ? (
          <Box className="page-child" sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {emptyHint}
            </Typography>
            <RevoraButton component={Link} href="/cars" variant="contained">
              Browse cars
            </RevoraButton>
          </Box>
        ) : (
          <>
            <Typography className="page-child" color="text.secondary" sx={{ mb: 3 }}>
              Pick a car to open the {actionPath === "configure" ? "configurator" : "tuning studio"}.
            </Typography>
            <Grid ref={gridRef} container spacing={3} className="gsap-stagger-container">
              {cars.map((car) => (
                <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }} className="page-child gsap-stagger-item">
                  <CarCard car={car} href={`/${actionPath}/${car.id}`} />
                </Grid>
              ))}
            </Grid>
            <Box className="page-child" sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <RevoraButton component={Link} href="/cars" variant="outlined">
                View all cars
              </RevoraButton>
            </Box>
          </>
        )}
      </Container>
    </PageReveal>
  );
}
