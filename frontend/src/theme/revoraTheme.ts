"use client";

import { createTheme } from "@mui/material/styles";
import { revoraColors } from "./colors";

declare module "@mui/material/styles" {
  interface TypeBackground {
    elevated: string;
  }
}

export const revoraTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: revoraColors.signal, contrastText: revoraColors.ice },
    secondary: { main: revoraColors.steel, contrastText: revoraColors.bg },
    background: {
      default: revoraColors.bg,
      paper: revoraColors.paper,
      elevated: revoraColors.elevated,
    },
    text: { primary: revoraColors.ice, secondary: revoraColors.steel },
    divider: revoraColors.border,
    error: { main: revoraColors.signal },
    success: { main: "#3DDC97" },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    h1: {
      fontFamily: "var(--font-syne), var(--font-geist-sans), sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.04em",
      lineHeight: 0.92,
    },
    h2: {
      fontFamily: "var(--font-syne), var(--font-geist-sans), sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontFamily: "var(--font-syne), var(--font-geist-sans), sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h4: {
      fontFamily: "var(--font-syne), var(--font-geist-sans), sans-serif",
      fontWeight: 700,
    },
    button: {
      fontFamily: "var(--font-syne), sans-serif",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    overline: {
      letterSpacing: "0.22em",
      fontWeight: 600,
    },
  },
  shape: { borderRadius: 8 },
  shadows: Array(25).fill("none") as unknown as ReturnType<typeof createTheme>["shadows"],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: revoraColors.bg,
          backgroundImage: revoraColors.gradient,
          backgroundAttachment: "fixed",
          color: revoraColors.ice,
        },
        "::selection": {
          backgroundColor: revoraColors.signal,
          color: revoraColors.ice,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: "10px 20px",
          "&.MuiButton-containedPrimary": {
            backgroundColor: revoraColors.signal,
            "&:hover": { backgroundColor: "#c31322" },
          },
        },
        outlined: {
          borderColor: revoraColors.borderHover,
          color: revoraColors.ice,
          "&:hover": {
            borderColor: revoraColors.ice,
            backgroundColor: "rgba(174, 203, 235, 0.06)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: revoraColors.paper,
          border: `1px solid ${revoraColors.border}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: revoraColors.paper,
          border: `1px solid ${revoraColors.border}`,
          borderRadius: 8,
          transition: "border-color 0.3s ease, transform 0.3s ease",
          "&:hover": {
            borderColor: revoraColors.borderHover,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "filled" },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: revoraColors.elevated,
          borderRadius: 6,
          "&:before, &:after": { display: "none" },
          "&:hover": { backgroundColor: "#234060" },
          "&.Mui-focused": { backgroundColor: "#234060" },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(12, 24, 41, 0.82)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${revoraColors.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: revoraColors.elevated,
          border: `1px solid ${revoraColors.border}`,
        },
      },
    },
  },
});

export const specFont = "var(--font-geist-mono), ui-monospace, monospace";
