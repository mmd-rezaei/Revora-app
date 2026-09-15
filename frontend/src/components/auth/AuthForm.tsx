"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RevoraButton from "@/components/ui/RevoraButton";
import { login, register } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api/client";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result =
        mode === "register"
          ? await register({ name, email, password })
          : await login({ email, password });
      setUser(result.user);
      router.push("/garage");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not authenticate");
    } finally {
      setPending(false);
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        {mode === "login" ? "Sign in" : "Create account"}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Save builds, submit cars, and open your garage.
      </Typography>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
        {mode === "register" ? (
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        ) : null}
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === "login" ? "current-password" : "new-password"} />
        <RevoraButton type="submit" variant="contained" disabled={pending}>
          {mode === "login" ? "Sign in" : "Create account"}
        </RevoraButton>
      </Box>
      <Typography variant="body2" sx={{ mt: 3 }}>
        {mode === "login" ? (
          <>No account? <Link href="/auth/register">Register</Link></>
        ) : (
          <>Already on REVORA? <Link href="/auth/login">Sign in</Link></>
        )}
      </Typography>
    </Container>
  );
}
