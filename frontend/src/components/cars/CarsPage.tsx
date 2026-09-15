"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { useQuery } from "@tanstack/react-query";
import CarCard from "@/components/ui/CarCard";
import SectionHeader from "@/components/ui/SectionHeader";
import PageLoader from "@/components/ui/PageLoader";
import EmptyState from "@/components/ui/EmptyState";
import RevoraButton from "@/components/ui/RevoraButton";
import PageReveal from "@/components/ui/PageReveal";
import { fetchCars } from "@/lib/api/cars";
import { fetchBrands } from "@/lib/api/brands";

const bodyTypes = ["Sedan", "Coupe", "Hatchback", "Wagon", "SUV", "Convertible", "Pickup", "Roadster"];
const fuels = ["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"];
const transmissions = ["Manual", "Automatic", "DCT", "CVT", "Single-Speed"];
const drives = ["RWD", "FWD", "AWD", "4WD"];

export default function CarsPage() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [driveType, setDriveType] = useState("");
  const [sort, setSort] = useState("horsepower");
  const [hp, setHp] = useState<number[]>([100, 1100]);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      brand: brand || undefined,
      bodyType: bodyType || undefined,
      fuelType: fuelType || undefined,
      transmission: transmission || undefined,
      driveType: driveType || undefined,
      minHp: hp[0],
      maxHp: hp[1],
      sort,
      page,
      limit: 12,
    }),
    [search, brand, bodyType, fuelType, transmission, driveType, hp, sort, page],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["cars", filters],
    queryFn: () => fetchCars(filters),
  });
  const { data: brands = [] } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands });

  const filterForm = (
    <Box sx={{ display: "grid", gap: 2 }}>
      <TextField select label="Brand" value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1); }}>
        <MenuItem value="">All brands</MenuItem>
        {brands.map((item) => (
          <MenuItem key={item.id} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Body" value={bodyType} onChange={(e) => { setBodyType(e.target.value); setPage(1); }}>
        <MenuItem value="">All</MenuItem>
        {bodyTypes.map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField select label="Fuel" value={fuelType} onChange={(e) => { setFuelType(e.target.value); setPage(1); }}>
        <MenuItem value="">All</MenuItem>
        {fuels.map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField select label="Transmission" value={transmission} onChange={(e) => { setTransmission(e.target.value); setPage(1); }}>
        <MenuItem value="">All</MenuItem>
        {transmissions.map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField select label="Drive" value={driveType} onChange={(e) => { setDriveType(e.target.value); setPage(1); }}>
        <MenuItem value="">All</MenuItem>
        {drives.map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Horsepower {hp[0]}–{hp[1]}
        </Typography>
        <Slider min={50} max={1200} value={hp} onChange={(_, value) => { setHp(value as number[]); setPage(1); }} />
      </Box>
    </Box>
  );

  return (
    <PageReveal>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <SectionHeader title="Discover cars" subtitle="Search, filter, and open a machine. Then configure, tune, or compare." />
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search brand, model, trim"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            sx={{ flex: 1, minWidth: 220 }}
          />
          <TextField select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="horsepower">Horsepower</MenuItem>
            <MenuItem value="zeroToHundred">0–100</MenuItem>
            <MenuItem value="topSpeed">Top speed</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </TextField>
          <RevoraButton variant="outlined" onClick={() => setFiltersOpen(true)} sx={{ display: { md: "none" } }}>
            Filters
          </RevoraButton>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
            {filterForm}
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            {isLoading ? (
              <PageLoader />
            ) : !data?.items.length ? (
              <EmptyState title="No cars match" body="Widen the filters or try another search." />
            ) : (
              <>
                <Grid container spacing={3}>
                  {data.items.map((car) => (
                    <Grid key={car.id} size={{ xs: 12, sm: 6 }}>
                      <CarCard car={car} />
                    </Grid>
                  ))}
                </Grid>
                {data.pages > 1 ? (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination page={page} count={data.pages} onChange={(_, value) => setPage(value)} color="primary" />
                  </Box>
                ) : null}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
      <Drawer anchor="bottom" open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <Box sx={{ p: 3 }}>{filterForm}</Box>
      </Drawer>
    </PageReveal>
  );
}
