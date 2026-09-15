import type { Metadata } from "next";
import ComparePage from "@/components/compare/ComparePage";

export const metadata: Metadata = { title: "Compare" };

export default function Page() {
  return <ComparePage />;
}
