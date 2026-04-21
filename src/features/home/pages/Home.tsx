import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HomeInsightSection } from '../components/HomeInsightSection';
import { SpecialProgramsSection } from '../components/SpecialProgramsSection';
import { ApplicationProcessSection } from '../components/ApplicationProcessSection';
import { StatsSection } from '../components/StatsSection';
import { CTASection } from '../components/CTASection';

export function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HomeInsightSection />
      <SpecialProgramsSection />
      <ApplicationProcessSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}
