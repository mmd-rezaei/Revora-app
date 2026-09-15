"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import RevoraButton from "@/components/ui/RevoraButton";
import SectionHeader from "@/components/ui/SectionHeader";
import PageReveal from "@/components/ui/PageReveal";
import { useCompareStore } from "@/store/compareStore";
import { specFont } from "@/theme/revoraTheme";
import type { Car } from "@/types";

const specRows: { key: keyof Car; label: string; lowerIsBetter?: boolean }[] = [
  { key: "horsepower", label: "Horsepower" },
  { key: "torque", label: "Torque" },
  { key: "zeroToHundred", label: "0–100 km/h", lowerIsBetter: true },
  { key: "topSpeed", label: "Top speed" },
  { key: "weight", label: "Weight", lowerIsBetter: true },
  { key: "engine", label: "Engine" },
  { key: "transmission", label: "Transmission" },
  { key: "driveType", label: "Drive" },
  { key: "fuelType", label: "Fuel" },
];

function getWinner(values: (number | undefined)[], lowerIsBetter = false) {
  const nums = values
    .map((value, index) => (typeof value === "number" ? { value, index } : null))
    .filter((item): item is { value: number; index: number } => Boolean(item));
  if (nums.length < 2) return -1;
  const sorted = [...nums].sort((a, b) => (lowerIsBetter ? a.value - b.value : b.value - a.value));
  return sorted[0].value === sorted[1]?.value ? -1 : sorted[0].index;
}

export default function ComparePage() {
  const { cars, removeCar, clear } = useCompareStore();

  if (cars.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <SectionHeader title="Compare cars" subtitle="Add up to three cars from a detail page." align="center" />
        <RevoraButton component={Link} href="/cars" variant="contained">Browse cars</RevoraButton>
      </Container>
    );
  }

  return (
    <PageReveal>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, gap: 2, flexWrap: "wrap" }}>
          <SectionHeader title="Compare" subtitle={`${cars.length} vehicle${cars.length > 1 ? "s" : ""}`} />
          <RevoraButton onClick={clear}>Clear all</RevoraButton>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                {cars.map((car) => (
                  <TableCell key={car.id} sx={{ minWidth: 180 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="overline">{car.brandName}</Typography>
                        <Typography variant="h6">{car.modelName}</Typography>
                        <Typography variant="body2" color="text.secondary">{car.trim}</Typography>
                      </Box>
                      <IconButton size="small" onClick={() => removeCar(car.id)} aria-label="Remove">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {specRows.map((row) => {
                const values = cars.map((car) => car[row.key]);
                const winner = typeof values[0] === "number" ? getWinner(values as number[], row.lowerIsBetter) : -1;
                return (
                  <TableRow key={row.key}>
                    <TableCell sx={{ color: "text.secondary" }}>{row.label}</TableCell>
                    {values.map((value, index) => (
                      <TableCell key={`${row.key}-${index}`} sx={{ fontFamily: specFont, color: winner === index ? "primary.main" : "text.primary", fontWeight: winner === index ? 700 : 400 }}>
                        {String(value)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Container>
    </PageReveal>
  );
}
