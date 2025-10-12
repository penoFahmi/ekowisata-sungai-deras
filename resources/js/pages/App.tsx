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
import { UmkmDetailModal } from "@/components/umkm/UmkmDetailModal";
import { AgendaDetailModal } from "@/components/agenda/AgendaDetailModal";

interface AppProps extends PageProps {
    tourismSpots: TourismSpot[];
    umkms: Umkm[];
    agendas: Agenda[];
}

export default function App() {
    const { tourismSpots, umkms, agendas } = usePage<AppProps>().props;
    const [selectedSpot, setSelectedSpot] = React.useState<TourismSpot | null>(null);
    const [selectedUmkm, setSelectedUmkm] = React.useState<Umkm | null>(null);
    const [selectedAgenda, setSelectedAgenda] = React.useState<Agenda | null>(null);

    return (
        <div className="min-h-screen bg-stone-100 dark:bg-slate-900">
            <Navigation />
            <main>
                <HeroSection />
                <FeaturedAttractions tourismSpots={tourismSpots} onSelectSpot={setSelectedSpot} />
                <InteractiveMap tourismSpots={tourismSpots} umkms={umkms} />
                <UMKMSection umkms={umkms} onSelectUmkm={setSelectedUmkm} />
                <EventsSection agendas={agendas} onSelectAgenda={setSelectedAgenda} />
            </main>
            <Footer />

            {/* Modal akan muncul ketika 'selectedSpot' tidak null */}
            <WisataDetailModal
                spot={selectedSpot}
                isOpen={!!selectedSpot}
                onClose={() => setSelectedSpot(null)}
            />
            <UmkmDetailModal
                umkm={selectedUmkm}
                isOpen={!!selectedUmkm}
                onClose={() => setSelectedUmkm(null)}
            />
            <AgendaDetailModal
                agenda={selectedAgenda}
                isOpen={!!selectedAgenda}
                onClose={() => setSelectedAgenda(null)}
            />
        </div>
    );
}
