import ShopHeroSection from "@/components/shop/ShopHeroSection";
import ProductGrid from "@/components/shop/ProductGrid";
import { getAllProducts } from "@/app/api/shop/shop";
import { getShopPageContent } from "@/app/api/shop/shopPage";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const searchQuery = q?.trim() ?? "";

  const [productsResponse, shopContent] = await Promise.all([
    getAllProducts(),
    getShopPageContent(),
  ]);

  const products = productsResponse?.data ?? [];

  return (
    <>
      <ShopHeroSection hero={shopContent.hero} />
      <ProductGrid products={products} searchQuery={searchQuery} />
    </>
  );
}
