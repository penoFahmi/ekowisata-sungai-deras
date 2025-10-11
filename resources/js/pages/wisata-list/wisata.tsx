import { Link, Head, usePage, router } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, TourismSpot } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Mountain, Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { route } from 'ziggy-js';
import { WisataDetailModal } from '@/components/wisata/WisataDetailModal';
import { HeroSectionSecond } from '@/components/landing-page/hero-section-second';

interface WisataIndexProps extends PageProps {
    tourismSpots: PaginatedResponse<TourismSpot>;
    filters: {
        search?: string;
    }
}

export default function WisataIndex() {
    const { tourismSpots, filters } = usePage<WisataIndexProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);
    const [selectedSpot, setSelectedSpot] = useState<TourismSpot | null>(null);

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Wisata';
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        router.get(route('wisata-list.index'), { search: debouncedSearchTerm }, { preserveState: true, replace: true, preserveScroll: true });

    }, [debouncedSearchTerm]);

    return (
        <div className="min-h-screen bg-background">
            <Head title="Semua Wisata" />
            <Navigation />
            <HeroSectionSecond
                title="Semua Destinasi Wisata"
                description="Temukan dan jelajahi setiap sudut keindahan yang ditawarkan oleh Desa Sungai Deras."
            />
            <main>
                <section id="semua-wisata" className="py-20 md:py-28 bg-muted/30">
                    <div className="container mx-auto px-4">
                        {/* Search Input */}
                        <div className="mb-16 max-w-lg mx-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau deskripsi wisata..."
                                    className="pl-10 h-12 text-base"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {tourismSpots.data.length === 0 && (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold mb-2">Wisata Tidak Ditemukan</h3>
                                <p className="text-muted-foreground">
                                    Coba gunakan kata kunci lain untuk menemukan destinasi yang Anda cari.
                                </p>
                            </div>
                        )}


                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {tourismSpots.data.map((spot) => (
                                <Card key={spot.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                                    <CardHeader className="p-0">
                                        <div className="relative overflow-hidden aspect-video">
                                            <ImageWithFallback
                                                src={getImageUrl(spot.galleries[0]?.path)}
                                                alt={spot.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Badge variant="secondary" className="absolute top-3 left-3">{spot.category.name}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 flex-grow">
                                        <h3 className="text-xl font-semibold mb-2">{spot.name}</h3>
                                        <div className="flex items-start text-sm text-muted-foreground mb-3">
                                            <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                                            <span>{spot.address}</span>
                                        </div>
                                        <p className="text-muted-foreground line-clamp-2">
                                            {spot.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0">
                                        <Button className="w-full" onClick={() => setSelectedSpot(spot)}>
                                            Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {tourismSpots.data.length > 0 && (
                            <Pagination>
                                <PaginationContent>
                                    {tourismSpots.links.map((link, index) => (
                                        <PaginationItem key={index} className={!link.url ? 'opacity-50 pointer-events-none' : ''}>
                                            <PaginationLink asChild isActive={link.active}>
                                                <Link href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} preserveState preserveScroll />
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </section>
            </main>

            <WisataDetailModal spot={selectedSpot} isOpen={!!selectedSpot} onClose={() => setSelectedSpot(null)} />
            <Footer />
        </div>
    );
}
