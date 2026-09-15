"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import SectionHeader from "@/components/ui/SectionHeader";
import PageLoader from "@/components/ui/PageLoader";
import PageReveal from "@/components/ui/PageReveal";
import { fetchBrands } from "@/lib/api/brands";

export default function BrandsPage() {
  const { data: brands = [], isLoading } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands });
  if (isLoading) return <PageLoader />;

  return (
    <PageReveal>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <SectionHeader title="Brands" subtitle="Pick a manufacturer, then a model, then a trim." />
        <Grid container spacing={2}>
          {brands.map((brand) => (
            <Grid key={brand.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                component={Link}
                href={`/brands/${brand.slug}`}
                sx={{
                  display: "block",
                  p: 3,
                  border: "1px solid rgba(244,241,234,0.08)",
                  bgcolor: "#0E0E11",
                  height: "100%",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <Typography variant="overline" color="text.secondary">{brand.country}</Typography>
                <Typography variant="h4">{brand.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{brand.carCount || 0} cars in catalog</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageReveal>
  );
}
