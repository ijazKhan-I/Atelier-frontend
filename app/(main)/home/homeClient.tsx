import HomeHeroSection from "@/components/home/HomeHeroSection";
import type { HomePageContent } from "@/type/homeType";

type Props = {
  content: HomePageContent;
};

export default function HomeClient({ content }: Props) {
  return <HomeHeroSection content={content} />;
}
