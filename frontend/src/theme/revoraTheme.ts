"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    elevated: string;
  }
}

export const revoraTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#E11D2E", contrastText: "#F4F1EA" },
    secondary: { main: "#C5C1B6", contrastText: "#050506" },
    background: {
      default: "#050506",
      paper: "#0E0E11",
      elevated: "#16161A",
    },
    text: { primary: "#F4F1EA", secondary: "#8A8F98" },
    divider: "rgba(244,241,234,0.08)",
    error: { main: "#E11D2E" },
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
  shadows: [
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#050506",
          color: "#F4F1EA",
        },
        "::selection": {
          backgroundColor: "#E11D2E",
          color: "#F4F1EA",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: "10px 20px",
        },
        containedPrimary: {
          backgroundColor: "#E11D2E",
          "&:hover": { backgroundColor: "#c31322" },
        },
        outlined: {
          borderColor: "rgba(244,241,234,0.22)",
          color: "#F4F1EA",
          "&:hover": {
            borderColor: "#F4F1EA",
            backgroundColor: "rgba(244,241,234,0.04)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0E0E11",
          border: "1px solid rgba(244,241,234,0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0E0E11",
          border: "1px solid rgba(244,241,234,0.08)",
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "filled" },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#16161A",
          borderRadius: 6,
          "&:before, &:after": { display: "none" },
          "&:hover": { backgroundColor: "#1c1c21" },
          "&.Mui-focused": { backgroundColor: "#1c1c21" },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(5,5,6,0.78)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(244,241,234,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "#16161A",
          border: "1px solid rgba(244,241,234,0.08)",
        },
      },
    },
  },
});

export const specFont = "var(--font-geist-mono), ui-monospace, monospace";
