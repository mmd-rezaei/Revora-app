import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Register" };

export default function Page() {
  return <AuthForm mode="register" />;
}
