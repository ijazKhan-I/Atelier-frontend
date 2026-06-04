import HomeClient from "./homeClient";
import { getTrendingSection } from "@/app/api/home/home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trendingSection = await getTrendingSection();

  return <HomeClient trendingSection={trendingSection} />;
}
