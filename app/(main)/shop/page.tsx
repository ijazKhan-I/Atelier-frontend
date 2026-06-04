import Hero from "@/components/shop/ShopHeroSection";
import ProductGrid from "@/components/shop/ProductGrid";
import { getAllProducts } from "@/app/api/shop/shop";

export default async function Page() {
  const productsResponse = await getAllProducts();
  const products = productsResponse?.data ?? [];
  console.log(products)


  return (
    <>
      <Hero />
      <ProductGrid products={products} />
    </>
  );
}
