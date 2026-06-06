import { fetchStrapi } from "@/app/api/strapi";
import { getStrapiImageUrl } from "@/lib/strapi-media";
import type {
  HomeButton,
  HomeCurationCard,
  HomeHeroSection,
  HomeNewsletterSection,
  HomePage,
  HomePageContent,
  HomePhilosophySection,
  TrendingSectionData,
} from "@/type/homeType";
import type { Product, StrapiSingleResponse } from "@/type/shopType";

/** Local asset fallbacks when Strapi media is not uploaded yet. */
const FALLBACK_IMAGES = {
  hero: "/assets/home_hero_img.png",
  curationPrimary: "/assets/home_fession.png",
  curationSecondary: "/assets/home_style.png",
  philosophy: "/assets/Process.png",
} as const;

const DEFAULT_BUTTON_PRIMARY: HomeButton = {
  buttonLabel: "Shop Now",
  buttonHref: "/shop",
  variant: "primary",
};

const DEFAULT_BUTTON_SECONDARY: HomeButton = {
  buttonLabel: "Discover More",
  buttonHref: "/about",
  variant: "outline",
};

/**
 * Strapi populate query — loads every Home Page section, buttons, and trending products.
 */
const HOME_PAGE_QUERY = [
  "populate[hero][populate][backgroundImage][populate]=*",
  "populate[hero][populate][primaryButton][populate]=*",
  "populate[hero][populate][secondaryButton][populate]=*",
  "populate[curationPrimary][populate][image][populate]=*",
  "populate[curationSecondary][populate][image][populate]=*",
  "populate[philosophy][populate][image][populate]=*",
  "populate[newsletter][populate]=*",
  "populate[trendingProducts][populate][image][populate]=*",
  "populate[trendingProducts][populate][category][populate]=*",
  "populate[trendingProducts][populate][productVariation][populate][image][populate]=*",
].join("&");

/** Default copy mirrors atelier-backend/src/api/home-page/home-defaults.ts */
const DEFAULT_CONTENT: HomePageContent = {
  hero: {
    badge: "Autumn / Winter 2024",
    heading: "The Art of Stillness",
    backgroundImageUrl: FALLBACK_IMAGES.hero,
    primaryButton: DEFAULT_BUTTON_PRIMARY,
    secondaryButton: DEFAULT_BUTTON_SECONDARY,
  },
  curationPrimary: {
    label: "Curation 01",
    heading: "Structured Elegance",
    description:
      "Exploring the intersection of modern geometry and traditional tailoring techniques.",
    imageUrl: FALLBACK_IMAGES.curationPrimary,
    darkBackground: false,
    squareImage: false,
  },
  curationSecondary: {
    label: "Curation 02",
    heading: "The Minimalist Essential",
    description: "Timeless pieces designed for the discerning individual.",
    imageUrl: FALLBACK_IMAGES.curationSecondary,
    darkBackground: true,
    squareImage: true,
  },
  trending: {
    heading: "Trending Now",
    description: "The season's most-coveted silhouettes.",
    products: [],
  },
  philosophy: {
    label: "Our Philosophy",
    quote: '"Beauty lies in the omission of the unnecessary."',
    description:
      "Every Atelier piece is a dialogue between heritage craftsmanship and the modern silhouette. We believe in clothes that tell a story without saying a word.",
    linkLabel: "The Atelier Journal",
    linkUrl: "/about",
    imageUrl: FALLBACK_IMAGES.philosophy,
  },
  newsletter: {
    heading: "Join the Circle",
    description:
      "Receive early access to seasonal lookbooks and private collection releases.",
    inputPlaceholder: "EMAIL ADDRESS",
    submitLabel: "Subscribe",
  },
};

function resolveImage(image: { url?: string } | null | undefined, fallback: string) {
  return getStrapiImageUrl(image as Parameters<typeof getStrapiImageUrl>[0]) || fallback;
}

function mapButton(
  button: HomeButton | null | undefined,
  fallback: HomeButton
): HomeButton {
  if (!button?.buttonLabel) {
    return fallback;
  }

  return {
    buttonLabel: button.buttonLabel,
    buttonHref: button.buttonHref || fallback.buttonHref,
    variant: button.variant === "outline" ? "outline" : "primary",
  };
}

function mapCurationCard(
  card: HomePage["curationPrimary"],
  fallback: HomeCurationCard
): HomeCurationCard {
  if (!card?.heading) {
    return fallback;
  }

  return {
    label: card.label || fallback.label,
    heading: card.heading,
    description: card.description || fallback.description,
    imageUrl: resolveImage(card.image, fallback.imageUrl),
    darkBackground: Boolean(card.darkBackground),
    squareImage: Boolean(card.squareImage),
  };
}

function mapTrending(page: HomePage): TrendingSectionData {
  const products = (page.trendingProducts ?? []).filter(
    (product): product is Product => Boolean(product?.documentId || product?.id)
  );

  return {
    heading: page.trendingHeading?.trim() || DEFAULT_CONTENT.trending.heading,
    description:
      page.trendingDescription?.trim() || DEFAULT_CONTENT.trending.description,
    products,
  };
}

/** Map raw Strapi Home Page → frontend-friendly content. */
function mapHomePage(page: HomePage): HomePageContent {
  return {
    hero: {
      badge: page.hero?.badge || DEFAULT_CONTENT.hero.badge,
      heading: page.hero?.heading || DEFAULT_CONTENT.hero.heading,
      backgroundImageUrl: resolveImage(
        page.hero?.backgroundImage,
        DEFAULT_CONTENT.hero.backgroundImageUrl
      ),
      primaryButton: mapButton(page.hero?.primaryButton, DEFAULT_BUTTON_PRIMARY),
      secondaryButton: mapButton(page.hero?.secondaryButton, DEFAULT_BUTTON_SECONDARY),
    },
    curationPrimary: mapCurationCard(
      page.curationPrimary,
      DEFAULT_CONTENT.curationPrimary
    ),
    curationSecondary: mapCurationCard(
      page.curationSecondary,
      DEFAULT_CONTENT.curationSecondary
    ),
    trending: mapTrending(page),
    philosophy: {
      label: page.philosophy?.label || DEFAULT_CONTENT.philosophy.label,
      quote: page.philosophy?.quote || DEFAULT_CONTENT.philosophy.quote,
      description: page.philosophy?.description || DEFAULT_CONTENT.philosophy.description,
      linkLabel: page.philosophy?.linkLabel || DEFAULT_CONTENT.philosophy.linkLabel,
      linkUrl: page.philosophy?.linkUrl || DEFAULT_CONTENT.philosophy.linkUrl,
      imageUrl: resolveImage(
        page.philosophy?.image,
        DEFAULT_CONTENT.philosophy.imageUrl
      ),
    },
    newsletter: {
      heading: page.newsletter?.heading || DEFAULT_CONTENT.newsletter.heading,
      description: page.newsletter?.description || DEFAULT_CONTENT.newsletter.description,
      inputPlaceholder:
        page.newsletter?.inputPlaceholder || DEFAULT_CONTENT.newsletter.inputPlaceholder,
      submitLabel: page.newsletter?.submitLabel || DEFAULT_CONTENT.newsletter.submitLabel,
    },
  };
}

async function fetchHomePageFromStrapi() {
  return fetchStrapi<StrapiSingleResponse<HomePage>>(`/api/home-page?${HOME_PAGE_QUERY}`);
}

/**
 * Load the full Home Page from Strapi (all sections + trending products).
 */
export async function getHomePageContent(): Promise<HomePageContent> {
  const response = await fetchHomePageFromStrapi();

  if (!response?.data?.hero) {
    console.warn(
      "[home] Could not load Home Page from Strapi. Enable Public → Home Page → find and restart Strapi."
    );
    return DEFAULT_CONTENT;
  }

  return mapHomePage(response.data);
}

/** Backward-compatible helper — trending only. */
export async function getTrendingSection(): Promise<TrendingSectionData> {
  const content = await getHomePageContent();
  return content.trending;
}

export { DEFAULT_CONTENT as defaultHomeContent };
