export type StrapiImageFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

export type StrapiImage = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  focalPoint: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type RichTextBlock = {
  type: string;
  children: {
    type: string;
    text: string;
  }[];
};

export type ProductVariation = {
  id: number;
  name: string;   // Red, Blue
  code: string;   // #fff43
  stock: number;
  price: number;
  size: string;   // M, XL
  image?: StrapiImage | null;
};

export type Category = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  slug: string;
  image?: StrapiImage | null;
  products?: Product[];
};

export type Product = {
  id: number;
  documentId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  price: number;
  shipping_info?: RichTextBlock[] | null;
  return_policy?: RichTextBlock[] | null;
  artisan_notes?: RichTextBlock[] | null;
  productVariation?: ProductVariation[];
  image?: StrapiImage[] | StrapiImage | null;
  category?: Category | null;
};

export type StrapiListResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingleResponse<T> = {
  data: T;
  meta: object;
};