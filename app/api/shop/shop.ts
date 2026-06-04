
import { fetchStrapi } from "../strapi";
import type { StrapiListResponse } from "@/type/shopType";
import type { Product } from "@/type/shopType";
import type { StrapiSingleResponse } from "@/type/shopType";
import type { Category } from "@/type/shopType";

export type ProductQueryFilters = {
  categorySlug?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?:
    | "Newest Arrivals"
    | "Price: Low to High"
    | "Price: High to Low"
    | "Name: A-Z";
};

function mapSortToStrapi(sortBy?: ProductQueryFilters["sortBy"]) {
  switch (sortBy) {
    case "Price: Low to High":
      return "price:asc";
    case "Price: High to Low":
      return "price:desc";
    case "Name: A-Z":
      return "name:asc";
    case "Newest Arrivals":
    default:
      return "createdAt:desc";
  }
}

function buildProductQuery(filters: ProductQueryFilters = {}) {
  const params = new URLSearchParams();

  params.append("populate[image][populate]", "*");
  params.append("populate[category][populate][image][populate]", "*");

  // ✅ IMPORTANT FIX
  params.append(
    "populate[productVariation][populate][image][populate]",
    "*"
  );

  params.append("sort[0]", mapSortToStrapi(filters.sortBy));

  if (filters.categorySlug) {
    params.append("filters[category][slug][$eq]", filters.categorySlug);
  }

  if (filters.size) {
    params.append("filters[productVariation][size][$eq]", filters.size);
  }

  if (filters.color) {
    params.append("filters[productVariation][name][$eq]", filters.color);
  }

  if (typeof filters.minPrice === "number" && typeof filters.maxPrice === "number") {
    params.append("filters[price][$between][0]", String(filters.minPrice));
    params.append("filters[price][$between][1]", String(filters.maxPrice));
  }

  return params.toString();
}

function buildCategoryProductsQuery(filters: ProductQueryFilters = {}) {
  const params = new URLSearchParams();

  params.append("populate[image]", "*");
  params.append("populate[products][populate][image]", "*");
  params.append("populate[products][populate][productVariation][populate][image]", "*");
  params.append("sort[0]", mapSortToStrapi(filters.sortBy));

  if (filters.categorySlug) {
    params.append("filters[slug][$eq]", filters.categorySlug);
  }

  if (filters.size) {
    params.append("filters[products][productVariation][size][$eq]", filters.size);
  }

  if (filters.color) {
    params.append("filters[products][productVariation][name][$eq]", filters.color);
  }

  if (typeof filters.minPrice === "number" && typeof filters.maxPrice === "number") {
    params.append("filters[products][price][$between][0]", String(filters.minPrice));
    params.append("filters[products][price][$between][1]", String(filters.maxPrice));
  } else if (typeof filters.minPrice === "number") {
    params.append("filters[products][price][$gte]", String(filters.minPrice));
  } else if (typeof filters.maxPrice === "number") {
    params.append("filters[products][price][$lte]", String(filters.maxPrice));
  }

  return params.toString();
}

export async function getAllProducts(filters: ProductQueryFilters = {}) {
  return await fetchStrapi<StrapiListResponse<Product>>(
    `/api/products?${buildProductQuery(filters)}`
  );
}

export async function getProductByDocumentId(documentId: string) {
  return await fetchStrapi<StrapiSingleResponse<Product>>(
    `/api/products/${documentId}?populate[image][populate]=*&populate[category][populate][image][populate]=*&populate[productVariation][populate][image][populate]=*`
  );
}

export async function getCategoriesWithProducts(
  filters: ProductQueryFilters = {}
) {
  const query = buildCategoryProductsQuery(filters);

  return await fetchStrapi<StrapiListResponse<Category>>(
    `/api/categories?${query}`
  );
}
