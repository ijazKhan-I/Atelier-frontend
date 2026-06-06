import ContactClient from "./contactClient";
import { getContactPageContent } from "@/app/api/contact/contact";

/** Always fetch fresh Contact content from Strapi. */
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getContactPageContent();

  return <ContactClient content={content} />;
}
