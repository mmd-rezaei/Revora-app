import type { Metadata } from "next";
import CarsPage from "@/components/cars/CarsPage";

export const metadata: Metadata = { title: "Cars" };

export default function Page() {
  return <CarsPage />;
}
