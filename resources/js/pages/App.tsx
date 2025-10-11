'use client'

import { usePage } from "@inertiajs/react";
import { Navigation } from "../components/landing-page/navigation";
import { HeroSection } from "../components/landing-page/hero-section";
import { FeaturedAttractions } from "../components/landing-page/featured-attractions";
import { InteractiveMap } from "../components/landing-page/interactive-map";
import { UMKMSection } from "../components/landing-page/umkm-section";
import { EventsSection } from "../components/landing-page/events-section";
import { TestimonialSection } from "../components/landing-page/testimonial-section";
import { Footer } from "../components/landing-page/footer";
import { PageProps, TourismSpot, Umkm, Agenda } from "@/types";

interface AppProps extends PageProps {
  tourismSpots: TourismSpot[];
  umkms: Umkm[];
  agendas: Agenda[];
}

export default function App() {
  const { tourismSpots, umkms, agendas } = usePage<AppProps>().props;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedAttractions tourismSpots={tourismSpots} />
        <InteractiveMap tourismSpots={tourismSpots} umkms={umkms} />
        <UMKMSection umkms={umkms} />
        <EventsSection agendas={agendas} />
        {/* <TestimonialSection /> */}
      </main>
      <Footer />
    </div>
  );
}
