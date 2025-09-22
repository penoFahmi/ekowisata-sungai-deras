'use client'

import { Navigation } from "../layouts/navigation";
import { HeroSection } from "../layouts/hero-section";
import { FeaturedAttractions } from "../layouts/featured-attractions";
import { InteractiveMap } from "../layouts/interactive-map";
import { UMKMSection } from "../layouts/umkm-section";
import { EventsSection } from "../layouts/events-section";
import { TestimonialSection } from "../layouts/testimonial-section";
import { Footer } from "../layouts/footer";

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
