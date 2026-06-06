import AboutClient from "./aboutClient";
import { getAboutPageContent } from "@/app/api/about/about";

/** Always fetch fresh About content from Strapi. */
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return <AboutClient content={content} />;
}
