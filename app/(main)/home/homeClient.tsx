import HomeHeroSection from "@/components/home/HomeHeroSection";
import type { TrendingSectionData } from "@/type/homeType";

type Props = {
  trendingSection: TrendingSectionData;
};

export default function HomeClient({ trendingSection }: Props) {
  return <HomeHeroSection trendingSection={trendingSection} />;
}
