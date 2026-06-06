import type { StrapiImage } from "@/type/shopType";

/** Visual style for a pillar grid cell (maps to Tailwind classes on the frontend). */
export type AboutPillarStyle = "white" | "black" | "gray";

export type AboutHeroSection = {
  title: string;
  subtitle: string;
  backgroundImage?: StrapiImage | null;
};

export type AboutHeritageSection = {
  title: string;
  paragraphOne: string;
  paragraphTwo: string;
};

export type AboutProcessSection = {
  label: string;
  title: string;
  description: string;
  linkLabel: string;
  linkUrl: string;
  image?: StrapiImage | null;
  cardLabel: string;
  cardQuote: string;
};

export type AboutPillarItem = {
  id?: number;
  title: string;
  description: string;
  style: AboutPillarStyle;
  image?: StrapiImage | null;
};

export type AboutUniformSection = {
  title: string;
  description: string;
  leftImage?: StrapiImage | null;
  rightImage?: StrapiImage | null;
};

/** Shape returned by GET /api/about (single type). */
export type AboutPage = {
  id: number;
  documentId: string;
  hero: AboutHeroSection;
  heritage: AboutHeritageSection;
  process: AboutProcessSection;
  pillarsHeading: string;
  pillars: AboutPillarItem[];
  uniform: AboutUniformSection;
};

/** Normalized data passed from the server page into AboutClient. */
export type AboutPageContent = {
  hero: AboutHeroSection & { backgroundImageUrl: string };
  heritage: AboutHeritageSection;
  process: AboutProcessSection & { imageUrl: string };
  pillarsHeading: string;
  pillars: Array<AboutPillarItem & { imageUrl?: string }>;
  uniform: AboutUniformSection & { leftImageUrl: string; rightImageUrl: string };
};
