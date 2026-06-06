import { fetchStrapi } from "@/app/api/strapi";
import { getStrapiImageUrl } from "@/lib/strapi-media";
import type {
  AboutPage,
  AboutPageContent,
  AboutPillarItem,
  AboutPillarStyle,
} from "@/type/aboutType";
import type { StrapiSingleResponse } from "@/type/shopType";

/** Fallback images when Strapi media fields are empty. */
const FALLBACK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop",
  process:
    "https://images.unsplash.com/photo-1455395701849-55a7c066a11a?q=80&w=1974&auto=format&fit=crop",
  pillarFabric:
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
  uniformLeft:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop",
  uniformRight:
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2010&auto=format&fit=crop",
} as const;

/**
 * Strapi populate query — loads every About component and nested media.
 * Adjust here if you add new fields to the About single type.
 */
const ABOUT_PAGE_QUERY = [
  "populate[hero][populate][backgroundImage][populate]=*",
  "populate[heritage][populate]=*",
  "populate[process][populate][image][populate]=*",
  "populate[pillars][populate][image][populate]=*",
  "populate[uniform][populate][leftImage][populate]=*",
  "populate[uniform][populate][rightImage][populate]=*",
].join("&");

/** Default copy mirrors atelier-backend/src/api/about/about-defaults.ts */
const DEFAULT_CONTENT: AboutPageContent = {
  hero: {
    title: "Manifesto of Form",
    subtitle: "Autumn / Winter MMXXIV",
    backgroundImageUrl: FALLBACK_IMAGES.hero,
  },
  heritage: {
    title: "The Heritage of Silence",
    paragraphOne:
      "Founded in 1994, Atelier began as a singular vision: to create garments that whisper rather than shout. In an age of fast consumption, we chose the path of the artisan, where time is the ultimate luxury.",
    paragraphTwo:
      'Our philosophy is rooted in the concept of "Quiet Luxury"—the intersection of impeccable tailoring and the world\'s finest raw materials. Every piece is a dialogue between the wearer and the craft.',
  },
  process: {
    label: "The Process",
    title: "Artistry in the Details",
    description:
      "Our ateliers in Tuscany employ third-generation tailors who treat every seam as a work of art. We source only GOTS-certified silks and LWG-gold rated leathers, ensuring that our commitment to the planet matches our commitment to quality.",
    linkLabel: "Discover the Process",
    linkUrl: "/shop",
    cardLabel: "001 / The Stitch",
    cardQuote: '"Hand-finished seams in every silhouette."',
    imageUrl: FALLBACK_IMAGES.process,
  },
  pillarsHeading: "Our Pillars",
  pillars: [
    {
      title: "Sustainability",
      description:
        "A circular approach to fashion. We offer lifetime repairs on all garments to ensure they remain in your wardrobe, not the landfill.",
      style: "white",
      imageUrl: FALLBACK_IMAGES.pillarFabric,
    },
    {
      title: "Radical Integrity",
      description:
        "From our supply chain to our showroom floor, we maintain 100% transparency. Know who made your clothes and why they chose each material.",
      style: "black",
    },
    {
      title: "Craftsmanship",
      description:
        "Every garment passes through the hands of master artisans who honor traditional techniques while refining them for contemporary life.",
      style: "gray",
    },
    {
      title: "Quality",
      description:
        "Designing for the future, respecting the past. Trends fade; style is eternal. A limited production model focused on excellence over volume.",
      style: "gray",
    },
  ],
  uniform: {
    title: "Defining the Modern Uniform",
    description:
      "A modular wardrobe designed for the global citizen. Effortless, adaptable, and unmistakably Atelier.",
    leftImageUrl: FALLBACK_IMAGES.uniformLeft,
    rightImageUrl: FALLBACK_IMAGES.uniformRight,
  },
};

function mediaUrl(image: AboutPage["hero"]["backgroundImage"], fallback: string) {
  return getStrapiImageUrl(image) || fallback;
}

function normalizePillarStyle(value: string | undefined): AboutPillarStyle {
  if (value === "black" || value === "gray" || value === "white") {
    return value;
  }

  return "white";
}

/** Map raw Strapi About entry → frontend-friendly content with resolved image URLs. */
function mapAboutPage(page: AboutPage): AboutPageContent {
  const pillars = (page.pillars ?? []).map((pillar: AboutPillarItem, index) => {
    const style = normalizePillarStyle(pillar.style);
    const uploadedImage = getStrapiImageUrl(pillar.image);

    return {
      title: pillar.title,
      description: pillar.description,
      style,
      // First pillar (Sustainability) shows fabric image in the design.
      imageUrl:
        uploadedImage ||
        (index === 0 ? FALLBACK_IMAGES.pillarFabric : undefined),
    };
  });

  return {
    hero: {
      title: page.hero.title,
      subtitle: page.hero.subtitle,
      backgroundImageUrl: mediaUrl(page.hero.backgroundImage, FALLBACK_IMAGES.hero),
    },
    heritage: {
      title: page.heritage.title,
      paragraphOne: page.heritage.paragraphOne,
      paragraphTwo: page.heritage.paragraphTwo,
    },
    process: {
      label: page.process.label,
      title: page.process.title,
      description: page.process.description,
      linkLabel: page.process.linkLabel,
      linkUrl: page.process.linkUrl,
      cardLabel: page.process.cardLabel,
      cardQuote: page.process.cardQuote,
      imageUrl: mediaUrl(page.process.image, FALLBACK_IMAGES.process),
    },
    pillarsHeading: page.pillarsHeading || DEFAULT_CONTENT.pillarsHeading,
    pillars: pillars.length ? pillars : DEFAULT_CONTENT.pillars,
    uniform: {
      title: page.uniform.title,
      description: page.uniform.description,
      leftImageUrl: mediaUrl(page.uniform.leftImage, FALLBACK_IMAGES.uniformLeft),
      rightImageUrl: mediaUrl(page.uniform.rightImage, FALLBACK_IMAGES.uniformRight),
    },
  };
}

/** Load About page content from Strapi (single type). */
async function fetchAboutPageFromStrapi() {
  return fetchStrapi<StrapiSingleResponse<AboutPage>>(`/api/about?${ABOUT_PAGE_QUERY}`);
}

/**
 * Public helper used by the /about route.
 * Falls back to DEFAULT_CONTENT if Strapi is unreachable or empty.
 */
export async function getAboutPageContent(): Promise<AboutPageContent> {
  const response = await fetchAboutPageFromStrapi();

  if (!response?.data?.hero) {
    console.warn(
      "[about] Could not load About from Strapi. Enable Public → About → find and restart Strapi."
    );
    return DEFAULT_CONTENT;
  }

  return mapAboutPage(response.data);
}

export { DEFAULT_CONTENT as defaultAboutContent };
