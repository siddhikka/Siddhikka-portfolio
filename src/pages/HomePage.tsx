import FeaturedWork from "../components/FeaturedWork";
import HeroIntro from "../components/HeroIntro";
import ProcessSection from "../components/ProcessSection";
import WhyMeSection from "../components/WhyMeSection";

export default function HomePage() {
  return (
    <main>
      <HeroIntro />
      <FeaturedWork />
      <WhyMeSection />
      <ProcessSection />
    </main>
  );
}
