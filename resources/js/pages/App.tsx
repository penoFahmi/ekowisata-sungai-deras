'use client'

import { Navigation } from "../components/landing-page/navigation";
import { HeroSection } from "../components/landing-page/hero-section";
import { FeaturedAttractions } from "../components/landing-page/featured-attractions";
import { InteractiveMap } from "../components/landing-page/interactive-map";
import { UMKMSection } from "../components/landing-page/umkm-section";
import { EventsSection } from "../components/landing-page/events-section";
import { TestimonialSection } from "../components/landing-page/testimonial-section";
import { Footer } from "../components/landing-page/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedAttractions />
        <InteractiveMap />
        <UMKMSection />
        <EventsSection />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
}
