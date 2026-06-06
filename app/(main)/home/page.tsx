import HomeClient from "./homeClient";
import { getHomePageContent } from "@/app/api/home/home";

/** Always fetch fresh Home Page content from Strapi. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getHomePageContent();

  return <HomeClient content={content} />;
}
