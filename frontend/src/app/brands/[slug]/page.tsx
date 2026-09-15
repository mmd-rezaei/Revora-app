import BrandDetailPage from "@/components/brands/BrandDetailPage";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <BrandDetailPage params={params} />;
}
