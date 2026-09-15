"use client";

import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CompareTray from "./CompareTray";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <CompareTray />
      <Footer />
    </Box>
  );
}
