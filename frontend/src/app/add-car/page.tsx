import type { Metadata } from "next";
import AddCarPage from "@/components/add-car/AddCarPage";

export const metadata: Metadata = { title: "Add a Car" };

export default function Page() {
  return <AddCarPage />;
}
