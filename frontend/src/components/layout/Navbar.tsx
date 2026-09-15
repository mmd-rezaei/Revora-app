"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/lib/api/auth";
import RevoraButton from "@/components/ui/RevoraButton";

const links = [
  { href: "/cars", label: "Cars" },
  { href: "/brands", label: "Brands" },
  { href: "/compare", label: "Compare" },
  { href: "/garage", label: "Garage" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout().catch(() => undefined);
    setUser(null);
    router.push("/");
  }

  const navLinks = (
    <>
      {links.map((link) => (
        <Box
          key={link.href}
          component={Link}
          href={link.href}
          sx={{
            color: pathname.startsWith(link.href) ? "primary.main" : "text.primary",
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {link.label}
        </Box>
      ))}
    </>
  );

  return (
    <AppBar position="sticky" elevation={0} color="transparent">
      <Toolbar sx={{ minHeight: 72, gap: 3 }}>
        <Box component={Link} href="/" sx={{ display: "flex", alignItems: "baseline", gap: 1, mr: "auto" }}>
          <Typography sx={{ fontFamily: "var(--font-syne)", fontWeight: 800, letterSpacing: "0.18em", fontSize: 18 }}>
            REVORA
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            Build. Tune. Drive.
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, alignItems: "center" }}>
          {navLinks}
          <RevoraButton component={Link} href="/add-car" size="small" variant="outlined">
            + Add a Car
          </RevoraButton>
          {user ? (
            <>
              {user.role === "admin" ? (
                <Box component={Link} href="/admin" sx={{ fontSize: 13, letterSpacing: "0.12em" }}>
                  Admin
                </Box>
              ) : null}
              <RevoraButton size="small" onClick={handleLogout}>
                Sign out
              </RevoraButton>
            </>
          ) : (
            <RevoraButton component={Link} href="/auth/login" size="small" variant="contained">
              Sign in
            </RevoraButton>
          )}
        </Box>
        <IconButton color="inherit" onClick={() => setOpen(true)} sx={{ display: { md: "none" } }} aria-label="Open menu">
          <MenuIcon />
        </IconButton>
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 280, p: 2 }} role="presentation" onClick={() => setOpen(false)}>
            <List>
              {links.map((link) => (
                <ListItemButton key={link.href} component={Link} href={link.href}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              ))}
              <ListItemButton component={Link} href="/add-car">
                <ListItemText primary="Add a Car" />
              </ListItemButton>
              {user ? (
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Sign out" />
                </ListItemButton>
              ) : (
                <ListItemButton component={Link} href="/auth/login">
                  <ListItemText primary="Sign in" />
                </ListItemButton>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
