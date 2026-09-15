"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid rgba(244,241,234,0.08)",
        px: { xs: 2, md: 6 },
        py: 5,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography sx={{ fontFamily: "var(--font-syne)", letterSpacing: "0.18em", fontWeight: 800 }}>REVORA</Typography>
        <Typography variant="body2" color="text.secondary">
          Build. Tune. Drive.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Link href="/cars">Cars</Link>
        <Link href="/brands">Brands</Link>
        <Link href="/garage">Garage</Link>
      </Box>
    </Box>
  );
}
