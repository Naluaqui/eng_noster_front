import { ImpactSection } from '../components/ImpactSection';
import { BusinessMindsSection } from '../components/BusinessMindsSection';
import { LandingFooter } from '../components/LandingFooter';
import { LandingHero } from '../components/LandingHero';
import { ProductCarousel } from '../components/ProductCarousel';

export function LandingScreen() {
  return (
    <main className="landing-page">
      <LandingHero />
      <ImpactSection />
      <BusinessMindsSection />
      <ProductCarousel />
      <LandingFooter />
    </main>
  );
}
