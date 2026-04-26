import { ImpactSection } from '@/features/landing/components/ImpactSection';
import { BusinessMindsSection } from '@/features/landing/components/BusinessMindsSection';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingHero } from '@/features/landing/components/LandingHero';
import { ProductCarousel } from '@/features/landing/components/ProductCarousel';

export default function LandingRoute() {
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
