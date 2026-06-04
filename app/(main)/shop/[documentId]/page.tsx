import { notFound } from "next/navigation";
import ProductDetailView from "@/components/shop/ProductDetailView";
import {
  getAllProducts,
  getProductByDocumentId,
} from "@/app/api/shop/shop";

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

  const categoryProductsResponse = product.category?.slug
    ? await getAllProducts({ categorySlug: product.category.slug })
    : null;

  const categoryProducts =
    categoryProductsResponse?.data
      .filter((item) => item.documentId !== product.documentId)
      .slice(0, 8) ?? [];

  return (
    <ProductDetailView
      key={product.documentId}
      product={product}
      categoryProducts={categoryProducts}
    />
  );
}
