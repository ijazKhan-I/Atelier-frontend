import { notFound } from "next/navigation";
import ProductDetailView from "@/components/shop/ProductDetailView";
import {
  getProductByDocumentId,
  getRelatedCategoryProducts,
} from "@/app/api/shop/shop";

/** Always load fresh product + related items from Strapi (not stale build cache). */
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    documentId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { documentId } = await params;
  const productResponse = await getProductByDocumentId(documentId);

  const product = productResponse?.data;
  if (!product) {
    notFound();
  }

  const categoryProducts = await getRelatedCategoryProducts(product);

  return (
    <ProductDetailView
      key={product.documentId}
      product={product}
      categoryProducts={categoryProducts}
    />
  );
}
