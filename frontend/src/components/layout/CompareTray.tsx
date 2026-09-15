"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useCompareStore } from "@/store/compareStore";
import RevoraButton from "@/components/ui/RevoraButton";

export default function CompareTray() {
  const { cars, removeCar, clear } = useCompareStore();
  if (cars.length === 0) return null;

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: 20,
        borderTop: "1px solid rgba(244,241,234,0.1)",
        bgcolor: "rgba(5,5,6,0.92)",
        backdropFilter: "blur(12px)",
        px: { xs: 2, md: 4 },
        py: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        overflowX: "auto",
      }}
    >
      <Typography variant="overline" sx={{ whiteSpace: "nowrap" }}>
        Compare {cars.length}/3
      </Typography>
      {cars.map((car) => (
        <Box key={car.id} sx={{ display: "flex", alignItems: "center", gap: 0.5, border: "1px solid rgba(244,241,234,0.1)", px: 1, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {car.brandName} {car.modelName}
          </Typography>
          <IconButton size="small" onClick={() => removeCar(car.id)} aria-label={`Remove ${car.modelName}`}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
        <RevoraButton size="small" onClick={clear}>
          Clear
        </RevoraButton>
        <RevoraButton size="small" variant="contained" component={Link} href="/compare">
          Open
        </RevoraButton>
      </Box>
    </Box>
  );
}
