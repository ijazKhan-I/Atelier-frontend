import { fetchStrapi } from "@/app/api/strapi";
import type { TrendingSectionData } from "@/type/homeType";
import type { HomePage } from "@/type/homeType";
import type { StrapiSingleResponse } from "@/type/shopType";
import type { Product } from "@/type/shopType";

const DEFAULT_HEADING = "Trending Now";
const DEFAULT_DESCRIPTION = "The season's most-coveted silhouettes.";

const HOME_PAGE_QUERY = [
  "populate[trendingProducts][populate][image][populate]=*",
  "populate[trendingProducts][populate][category][populate]=*",
  "populate[trendingProducts][populate][productVariation][populate][image][populate]=*",
].join("&");

function buildTrendingSection(
  heading: string,
  description: string,
  products: Product[]
): TrendingSectionData {
  return { heading, description, products };
}

/** Load the Home Page single type, including only the linked trending products. */
async function fetchHomePageFromStrapi() {
  return fetchStrapi<StrapiSingleResponse<HomePage>>(
    `/api/home-page?${HOME_PAGE_QUERY}`
  );
}

/**
 * Trending products come only from the Home Page entry in Strapi.
 * Products are not guessed from the full shop catalog.
 */
export async function getTrendingSection(): Promise<TrendingSectionData> {
  const homePageResponse = await fetchHomePageFromStrapi();

  if (!homePageResponse?.data) {
    console.warn(
      "[trending] Could not load Home Page from Strapi. Enable Public → Home Page → find, then publish Home Page with trending products selected."
    );

    return buildTrendingSection(DEFAULT_HEADING, DEFAULT_DESCRIPTION, []);
  }

  const homePage = homePageResponse.data;
  const heading = homePage.trendingHeading?.trim() || DEFAULT_HEADING;
  const description =
    homePage.trendingDescription?.trim() || DEFAULT_DESCRIPTION;

  const selectedProducts = (homePage.trendingProducts ?? []).filter(
    (product): product is Product => Boolean(product?.documentId || product?.id)
  );

  return buildTrendingSection(heading, description, selectedProducts);
}
