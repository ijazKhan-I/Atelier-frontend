import { fetchStrapi } from "@/app/api/strapi";
import { getStrapiImageUrl } from "@/lib/strapi-media";
import type { ContactPage, ContactPageContent } from "@/type/contactType";
import type { StrapiSingleResponse } from "@/type/shopType";

/** Placeholder when no office image is uploaded in Strapi. */
const FALLBACK_OFFICE_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop";

/**
 * Strapi populate query — loads all Contact Page components and media.
 * Add new populate paths here when you extend the Contact Page schema.
 */
const CONTACT_PAGE_QUERY = [
  "populate[form][populate]=*",
  "populate[officeImage][populate]=*",
  "populate[directContact][populate]=*",
  "populate[socialLinks][populate]=*",
  "populate[locations][populate]=*",
].join("&");

/** Default copy mirrors atelier-backend/src/api/contact-page/contact-defaults.ts */
const DEFAULT_CONTENT: ContactPageContent = {
  title: "Get in Touch",
  description:
    "Whether you seek personalized styling advice or have inquiries regarding our latest collection, our atelier concierge is at your service.",
  form: {
    nameLabel: "Name",
    namePlaceholder: "Your full name",
    emailLabel: "Email Address",
    emailPlaceholder: "hello@example.com",
    messageLabel: "Message",
    messagePlaceholder: "How can we assist you?",
    submitLabel: "Send Inquiry",
  },
  officeImageUrl: FALLBACK_OFFICE_IMAGE,
  directContact: {
    directHeading: "Direct Communication",
    email: "atelier@gmail.com",
    phone: "+92 3144763488",
    socialsHeading: "Our Socials",
  },
  socialLinks: [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "Pinterest", url: "https://pinterest.com" },
    { label: "LinkedIn", url: "https://linkedin.com" },
  ],
  locationsHeading: "Flagship Locations",
  locations: [
    {
      city: "Peshawar",
      address: "Phase 3, Street 8",
      country: "Peshawar, Pakistan",
      hoursLabel: "Monday — Saturday",
      hoursTime: "10:00 — 19:00",
    },
    {
      city: "Islamabad",
      address: "F11 Markaz",
      country: "Islamabad, Pakistan",
      hoursLabel: "Monday — Saturday",
      hoursTime: "10:00 — 18:30",
    },
    {
      city: "Lahore",
      address: "Johar Town",
      country: "Lahore, Pakistan",
      hoursLabel: "Monday — Sunday",
      hoursTime: "11:00 — 20:00",
    },
  ],
};

/** Map Strapi entry → frontend-friendly content with resolved image URL. */
function mapContactPage(page: ContactPage): ContactPageContent {
  return {
    title: page.title || DEFAULT_CONTENT.title,
    description: page.description || DEFAULT_CONTENT.description,
    form: {
      nameLabel: page.form?.nameLabel || DEFAULT_CONTENT.form.nameLabel,
      namePlaceholder: page.form?.namePlaceholder || DEFAULT_CONTENT.form.namePlaceholder,
      emailLabel: page.form?.emailLabel || DEFAULT_CONTENT.form.emailLabel,
      emailPlaceholder: page.form?.emailPlaceholder || DEFAULT_CONTENT.form.emailPlaceholder,
      messageLabel: page.form?.messageLabel || DEFAULT_CONTENT.form.messageLabel,
      messagePlaceholder:
        page.form?.messagePlaceholder || DEFAULT_CONTENT.form.messagePlaceholder,
      submitLabel: page.form?.submitLabel || DEFAULT_CONTENT.form.submitLabel,
    },
    officeImageUrl: getStrapiImageUrl(page.officeImage) || FALLBACK_OFFICE_IMAGE,
    directContact: {
      directHeading:
        page.directContact?.directHeading || DEFAULT_CONTENT.directContact.directHeading,
      email: page.directContact?.email || DEFAULT_CONTENT.directContact.email,
      phone: page.directContact?.phone || DEFAULT_CONTENT.directContact.phone,
      socialsHeading:
        page.directContact?.socialsHeading || DEFAULT_CONTENT.directContact.socialsHeading,
    },
    socialLinks: page.socialLinks?.length ? page.socialLinks : DEFAULT_CONTENT.socialLinks,
    locationsHeading: page.locationsHeading || DEFAULT_CONTENT.locationsHeading,
    locations: page.locations?.length ? page.locations : DEFAULT_CONTENT.locations,
  };
}

/** Load Contact Page from Strapi single type. */
async function fetchContactPageFromStrapi() {
  return fetchStrapi<StrapiSingleResponse<ContactPage>>(
    `/api/contact-page?${CONTACT_PAGE_QUERY}`
  );
}

/**
 * Used by the /contact route.
 * Falls back to DEFAULT_CONTENT if Strapi is empty or unreachable.
 */
export async function getContactPageContent(): Promise<ContactPageContent> {
  const response = await fetchContactPageFromStrapi();

  if (!response?.data?.form) {
    console.warn(
      "[contact] Could not load Contact Page from Strapi. Enable Public → Contact Page → find and restart Strapi."
    );
    return DEFAULT_CONTENT;
  }

  return mapContactPage(response.data);
}

export { DEFAULT_CONTENT as defaultContactContent };
