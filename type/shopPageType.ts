export type ShopHeroSection = {
  badge: string;
  headingLines: string[];
  description: string;
  linkLabel: string;
  linkUrl: string;
};

export type ShopPageContent = {
  hero: ShopHeroSection;
};

/** Raw Strapi single type. */
export type ShopPage = {
  id: number;
  documentId: string;
  hero?: {
    badge?: string;
    heading?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
};
