"use client";

import Box from "@mui/material/Box";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import CompareTray from "./CompareTray";
import ScrollProgress from "./ScrollProgress";
import GlobalMotionLayer from "./GlobalMotionLayer";
import { useRouteScrollRefresh } from "@/hooks/useScrollReveal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useRouteScrollRefresh(pathname);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <GlobalMotionLayer />
      <ScrollProgress />
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          pt: "var(--navbar-height)",
          width: "100%",
          maxWidth: "100%",
          overflowX: "clip",
        }}
      >
        {children}
      </Box>
      <CompareTray />
      <Footer />
    </Box>
  );
}
