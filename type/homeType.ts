import type { Product, StrapiImage } from "@/type/shopType";

export type HomeButton = {
  buttonLabel: string;
  buttonHref: string;
  variant: "primary" | "outline";
};

export type HomeHeroSection = {
  badge: string;
  heading: string;
  backgroundImageUrl: string;
  primaryButton: HomeButton;
  secondaryButton: HomeButton;
};

export type HomeCurationCard = {
  label: string;
  heading: string;
  description: string;
  imageUrl: string;
  darkBackground: boolean;
  squareImage: boolean;
};

export type HomePhilosophySection = {
  label: string;
  quote: string;
  description: string;
  linkLabel: string;
  linkUrl: string;
  imageUrl: string;
};

export type HomeNewsletterSection = {
  heading: string;
  description: string;
  inputPlaceholder: string;
  submitLabel: string;
};

export type TrendingSectionData = {
  heading: string;
  description: string;
  products: Product[];
};

/** Raw Strapi single type (partial — media resolved on the server). */
export type HomePage = {
  id: number;
  documentId: string;
  hero?: {
    badge?: string;
    heading?: string;
    backgroundImage?: StrapiImage | null;
    primaryButton?: HomeButton | null;
    secondaryButton?: HomeButton | null;
  };
  curationPrimary?: {
    label?: string;
    heading?: string;
    description?: string;
    image?: StrapiImage | null;
    darkBackground?: boolean;
    squareImage?: boolean;
  };
  curationSecondary?: {
    label?: string;
    heading?: string;
    description?: string;
    image?: StrapiImage | null;
    darkBackground?: boolean;
    squareImage?: boolean;
  };
  trendingHeading?: string | null;
  trendingDescription?: string | null;
  trendingProducts?: Product[];
  philosophy?: {
    label?: string;
    quote?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
    image?: StrapiImage | null;
  };
  newsletter?: {
    heading?: string;
    description?: string;
    inputPlaceholder?: string;
    submitLabel?: string;
  };
};

/** Normalized content for HomeHeroSection. */
export type HomePageContent = {
  hero: HomeHeroSection;
  curationPrimary: HomeCurationCard;
  curationSecondary: HomeCurationCard;
  trending: TrendingSectionData;
  philosophy: HomePhilosophySection;
  newsletter: HomeNewsletterSection;
};
