"use client";

import { useEffect, useRef } from "react";
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
import gsap from "gsap";
import RevoraButton from "@/components/ui/RevoraButton";
import SectionHeader from "@/components/ui/SectionHeader";
import PageReveal from "@/components/ui/PageReveal";
import { useCompareStore } from "@/store/compareStore";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { animateRowProgress } from "@/lib/gsap/presets";
import { specFont } from "@/theme/revoraTheme";
import type { Car } from "@/types";

const specRows: { key: keyof Car; label: string; lowerIsBetter?: boolean; bar?: boolean }[] = [
  { key: "horsepower", label: "Horsepower", bar: true },
  { key: "torque", label: "Torque", bar: true },
  { key: "zeroToHundred", label: "0–100 km/h", lowerIsBetter: true, bar: true },
  { key: "topSpeed", label: "Top speed", bar: true },
  { key: "weight", label: "Weight", lowerIsBetter: true, bar: true },
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

function barProgress(key: keyof Car, value: unknown, cars: Car[]) {
  if (typeof value !== "number") return 0;
  const nums = cars.map((c) => c[key]).filter((v): v is number => typeof v === "number");
  if (!nums.length) return 0;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (max === min) return 1;
  const lowerIsBetter = key === "zeroToHundred" || key === "weight";
  return lowerIsBetter ? 1 - (value - min) / (max - min) : (value - min) / (max - min);
}

export default function ComparePage() {
  const { cars, removeCar, clear } = useCompareStore();
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cars.length || prefersReducedMotion()) return;
    registerGsapPlugins();
    const root = tableRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from(".compare-header-cell", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>(".compare-row").forEach((row, i) => {
        gsap.from(row, {
          x: -24,
          opacity: 0,
          duration: 0.55,
          delay: i * 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 92%", once: true },
        });
      });
      root.querySelectorAll<HTMLElement>(".compare-bar").forEach((bar) => {
        const progress = Number(bar.dataset.progress || 0);
        animateRowProgress(bar, progress);
      });
    }, root);

    return () => ctx.revert();
  }, [cars]);

  if (cars.length === 0) {
    return (
      <PageReveal>
        <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
          <SectionHeader title="Compare cars" subtitle="Add up to three cars from a detail page." align="center" />
          <RevoraButton component={Link} href="/cars" variant="contained">Browse cars</RevoraButton>
        </Container>
      </PageReveal>
    );
  }

  return (
    <PageReveal>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, gap: 2, flexWrap: "wrap" }} className="page-child">
          <SectionHeader title="Compare" subtitle={`${cars.length} vehicle${cars.length > 1 ? "s" : ""}`} />
          <RevoraButton onClick={clear}>Clear all</RevoraButton>
        </Box>
        <Box ref={tableRef} sx={{ overflowX: "auto" }} className="page-child">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                {cars.map((car) => (
                  <TableCell key={car.id} sx={{ minWidth: 180 }} className="compare-header-cell">
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
                  <TableRow key={row.key} className="compare-row">
                    <TableCell sx={{ color: "text.secondary" }}>{row.label}</TableCell>
                    {values.map((value, index) => (
                      <TableCell
                        key={`${row.key}-${index}`}
                        sx={{ fontFamily: specFont, color: winner === index ? "primary.main" : "text.primary", fontWeight: winner === index ? 700 : 400 }}
                      >
                        <Box>{String(value)}</Box>
                        {row.bar && typeof value === "number" ? (
                          <Box sx={{ mt: 1, height: 3, bgcolor: "rgba(244,241,234,0.08)", borderRadius: 1, overflow: "hidden" }}>
                            <Box
                              className="compare-bar"
                              data-progress={barProgress(row.key, value, cars)}
                              sx={{ height: "100%", width: "100%", bgcolor: winner === index ? "primary.main" : "rgba(225,29,46,0.45)", transform: "scaleX(0)", transformOrigin: "left" }}
                            />
                          </Box>
                        ) : null}
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
