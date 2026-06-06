import { fetchStrapi } from "@/app/api/strapi";
import type { ShopPage, ShopPageContent } from "@/type/shopPageType";
import type { StrapiSingleResponse } from "@/type/shopType";

const SHOP_PAGE_QUERY = ["populate[hero][populate]=*"].join("&");

/** Default copy mirrors atelier-backend/src/api/shop-page/shop-defaults.ts */
const DEFAULT_CONTENT: ShopPageContent = {
  hero: {
    badge: "New Season",
    headingLines: ["The Curator's", "Edit"],
    description:
      "A selection of sculptural silhouettes and noble fabrics, designed for the modern atelier. Explore our latest arrivals for the discerning eye.",
    linkLabel: "View Lookbook",
    linkUrl: "#",
  },
};

function splitHeading(heading?: string | null): string[] {
  const text = heading?.trim() || DEFAULT_CONTENT.hero.headingLines.join("\n");
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : DEFAULT_CONTENT.hero.headingLines;
}

function mapShopPage(page: ShopPage): ShopPageContent {
  const hero = page.hero;

  return {
    hero: {
      badge: hero?.badge?.trim() || DEFAULT_CONTENT.hero.badge,
      headingLines: splitHeading(hero?.heading),
      description: hero?.description?.trim() || DEFAULT_CONTENT.hero.description,
      linkLabel: hero?.linkLabel?.trim() || DEFAULT_CONTENT.hero.linkLabel,
      linkUrl: hero?.linkUrl?.trim() || DEFAULT_CONTENT.hero.linkUrl,
    },
  };
}

async function fetchShopPageFromStrapi() {
  return fetchStrapi<StrapiSingleResponse<ShopPage>>(`/api/shop-page?${SHOP_PAGE_QUERY}`);
}

/** Load Shop Page hero content from Strapi. */
export async function getShopPageContent(): Promise<ShopPageContent> {
  const response = await fetchShopPageFromStrapi();

  if (!response?.data?.hero) {
    console.warn(
      "[shop] Could not load Shop Page from Strapi. Enable Public → Shop Page → find and restart Strapi."
    );
    return DEFAULT_CONTENT;
  }

  return mapShopPage(response.data);
}

export { DEFAULT_CONTENT as defaultShopContent };
