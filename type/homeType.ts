import type { Product } from "@/type/shopType";

export type HomePage = {
  id: number;
  documentId: string;
  trendingHeading?: string | null;
  trendingDescription?: string | null;
  trendingProducts?: Product[];
};

export type TrendingSectionData = {
  heading: string;
  description: string;
  products: Product[];
};
