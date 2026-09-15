"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { revoraTheme } from "@/theme/revoraTheme";
import { useAuthStore } from "@/store/authStore";
import { fetchMe } from "@/lib/api/auth";
import AppShell from "@/components/layout/AppShell";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
      }),
  );
  const { setUser, setHydrated } = useAuthStore();

  useEffect(() => {
    fetchMe()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setHydrated(true));
  }, [setUser, setHydrated]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={revoraTheme}>
        <CssBaseline />
        <QueryClientProvider client={client}>
          <AppShell>{children}</AppShell>
        </QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
