"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import PageLoader from "@/components/ui/PageLoader";

export default function ProtectedRoute({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const { user, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/auth/login");
    else if (admin && user.role !== "admin") router.replace("/");
  }, [hydrated, user, admin, router]);

  if (!hydrated || !user || (admin && user.role !== "admin")) {
    return <PageLoader />;
  }

  return children;
}
