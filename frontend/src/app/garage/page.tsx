import type { Metadata } from "next";
import GaragePage from "@/components/garage/GaragePage";

export const metadata: Metadata = { title: "Garage" };

export default function Page() {
  return <GaragePage />;
}
