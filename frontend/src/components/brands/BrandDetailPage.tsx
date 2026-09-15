"use client";

import { use } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "@/components/ui/PageLoader";
import CarCard from "@/components/ui/CarCard";
import PageReveal from "@/components/ui/PageReveal";
import { fetchBrand } from "@/lib/api/brands";

export default function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading } = useQuery({ queryKey: ["brand", slug], queryFn: () => fetchBrand(slug) });
  if (isLoading || !data) return <PageLoader />;

  return (
    <PageReveal>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="overline">{data.brand.country}</Typography>
        <Typography variant="h2" sx={{ mb: 2 }}>{data.brand.name}</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 6 }}>{data.brand.description}</Typography>
        {data.models.map((model) => (
          <Box key={model.id} sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>{model.name}</Typography>
            <Grid container spacing={3}>
              {model.cars.map((car) => (
                <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <CarCard car={car} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </PageReveal>
  );
}
