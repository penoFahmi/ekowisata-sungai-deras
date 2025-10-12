'use client'
import React from "react";
import { usePage } from "@inertiajs/react";
import { Navigation } from "../components/landing-page/navigation";
import { HeroSection } from "../components/landing-page/hero-section";
import { FeaturedAttractions } from "../components/landing-page/featured-attractions";
import { InteractiveMap } from "../components/landing-page/interactive-map";
import { UMKMSection } from "../components/landing-page/umkm-section";
import { EventsSection } from "../components/landing-page/events-section";
import { Footer } from "../components/landing-page/footer";
import { PageProps, TourismSpot, Umkm, Agenda } from "@/types";
import { WisataDetailModal } from "../components/wisata/WisataDetailModal";

interface AppProps extends PageProps {
    tourismSpots: TourismSpot[];
    umkms: Umkm[];
    agendas: Agenda[];
}

export default function App() {
    const { tourismSpots, umkms, agendas } = usePage<AppProps>().props;
    const [selectedSpot, setSelectedSpot] = React.useState<TourismSpot | null>(null);

    return (
        <div className="min-h-screen bg-emerald-50 dark:bg-gray-900"> 
            <Navigation />
            <main>
                <HeroSection />
                <FeaturedAttractions tourismSpots={tourismSpots} onSelectSpot={setSelectedSpot} />
                <InteractiveMap tourismSpots={tourismSpots} umkms={umkms} />
                <UMKMSection umkms={umkms} />
                <EventsSection agendas={agendas} />
            </main>
            <Footer />

            {/* Modal akan muncul ketika 'selectedSpot' tidak null */}
            <WisataDetailModal
                spot={selectedSpot}
                isOpen={!!selectedSpot}
                onClose={() => setSelectedSpot(null)}
            />
        </div>
    );
}
