"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function PageLoader() {
  return (
    <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
      <CircularProgress color="primary" />
    </Box>
  );
}
