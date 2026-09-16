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
import CloseIcon from "@mui/icons-material/Close";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/authStore";
import { logout } from "@/lib/api/auth";

import RevoraButton from "@/components/ui/RevoraButton";
import "./Navbar.scss";

const MOBILE_MENU_MQL = "(max-width: 900px)";

const navLinks = [
  {
    label: "Cars",
    href: "/cars",
  },
  {
    label: "Brands",
    href: "/brands",
  },
  {
    label: "Compare",
    href: "/compare",
  },
  {
    label: "Configure",
    href: "/configure",
  },
  {
    label: "Tune",
    href: "/tune",
    highlight: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, setUser } = useAuthStore();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_MENU_MQL);

    const closeWhenNotMobile = () => {
      if (!mql.matches) setOpen(false);
    };

    closeWhenNotMobile();
    mql.addEventListener("change", closeWhenNotMobile);
    window.addEventListener("resize", closeWhenNotMobile);
    window.addEventListener("orientationchange", closeWhenNotMobile);
    document.addEventListener("fullscreenchange", closeWhenNotMobile);

    return () => {
      mql.removeEventListener("change", closeWhenNotMobile);
      window.removeEventListener("resize", closeWhenNotMobile);
      window.removeEventListener("orientationchange", closeWhenNotMobile);
      document.removeEventListener("fullscreenchange", closeWhenNotMobile);
    };
  }, []);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  async function handleLogout() {
    await logout().catch(() => undefined);

    setUser(null);
    setOpen(false);

    router.push("/");
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
    >
      <Toolbar className="navbar__toolbar">
        {/* Logo */}
        <Box component={Link} href="/" className="navbar__brand">
          <div className="brand-mark">
            <div className="brand-mark__logo">
              <span className="brand-mark__flame brand-mark__flame--1" />
              <span className="brand-mark__flame brand-mark__flame--2" />
              <span className="brand-mark__flame brand-mark__flame--3" />

              <span className="brand-mark__text">REVORA</span>
            </div>

            <div className="brand-mark__tagline">
              <span>Build.</span>
              <span className="brand-mark__tagline-highlight">Tune.</span>
              <span>Drive.</span>
            </div>
          </div>
        </Box>

        {/* Desktop Navigation */}
        <Box className="navbar__desktop">
          {/* Main Links */}
          <Box className="navbar__links">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Box
                  key={link.href}
                  component={Link}
                  href={link.href}
                  className={[
                    "navbar__link",
                    link.highlight ? "navbar__link--highlight" : "",
                    active ? "navbar__link--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {link.label}
                </Box>
              );
            })}
          </Box>

          {/* Divider */}
          <Box className="navbar__divider" />

          {/* Add Car */}
          <RevoraButton
            component={Link}
            href="/add-car"
            size="small"
            variant="outlined"
            className="navbar__add-car"
          >
            + Add Car
          </RevoraButton>

          {/* User Actions */}
          {user ? (
            <Box className="navbar__user">
              {user.role === "admin" && (
                <Box
                  component={Link}
                  href="/admin"
                  className={`navbar__admin ${
                    isActive("/admin") ? "navbar__admin--active" : ""
                  }`}
                >
                  Admin
                </Box>
              )}

              <RevoraButton
                size="small"
                variant="outlined"
                onClick={handleLogout}
                className="navbar__signout"
              >
                Sign Out
              </RevoraButton>
            </Box>
          ) : (
            <RevoraButton
              component={Link}
              href="/auth/login"
              size="small"
              variant="contained"
              className="navbar__signin"
            >
              Sign In
            </RevoraButton>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          onClick={() => (open ? handleCloseMenu() : setOpen(true))}
          className={`navbar__menu-button${open ? " navbar__menu-button--open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={open}
          onClose={handleCloseMenu}
          className="navbar__drawer"
        >
          <Box className="navbar__mobile">
            {/* Drawer Header */}
            <Box className="navbar__mobile-header">
              <Typography className="navbar__mobile-title">Menu</Typography>

              <IconButton
                onClick={handleCloseMenu}
                className="navbar__close-button"
                aria-label="Close menu"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Mobile Links */}
            <List className="navbar__mobile-links">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <ListItemButton
                    key={link.href}
                    component={Link}
                    href={link.href}
                    onClick={handleCloseMenu}
                    className={[
                      "navbar__mobile-link",
                      link.highlight ? "navbar__mobile-link--highlight" : "",
                      active ? "navbar__mobile-link--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                );
              })}

              {/* Garage */}
              {user && (
                <ListItemButton
                  component={Link}
                  href="/garage"
                  onClick={handleCloseMenu}
                  className={`navbar__mobile-link ${
                    isActive("/garage") ? "navbar__mobile-link--active" : ""
                  }`}
                >
                  <ListItemText primary="Garage" />
                </ListItemButton>
              )}

              {/* Add Car */}
              <ListItemButton
                component={Link}
                href="/add-car"
                onClick={handleCloseMenu}
                className="navbar__mobile-add-car"
              >
                <ListItemText primary="+ Add Car" />
              </ListItemButton>

              {/* User */}
              {user ? (
                <>
                  {user.role === "admin" && (
                    <ListItemButton
                      component={Link}
                      href="/admin"
                      onClick={handleCloseMenu}
                      className="navbar__mobile-link"
                    >
                      <ListItemText primary="Admin" />
                    </ListItemButton>
                  )}

                  <ListItemButton
                    onClick={handleLogout}
                    className="navbar__mobile-signout"
                  >
                    <ListItemText primary="Sign Out" />
                  </ListItemButton>
                </>
              ) : (
                <ListItemButton
                  component={Link}
                  href="/auth/login"
                  onClick={handleCloseMenu}
                  className="navbar__mobile-signin"
                >
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
