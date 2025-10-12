import { Link, Head, usePage, router } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, TourismSpot } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { route } from 'ziggy-js';
import { WisataDetailModal } from '@/components/wisata/WisataDetailModal';
import { HeroSectionSecond } from '@/components/landing-page/hero-section-second';
import { WaveDivider } from '@/components/landing-page/WaveDivider'; // <-- Pastikan path ini benar

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

    // Memisahkan link pagination untuk styling yang lebih baik
    const { links } = tourismSpots;
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        // Latar dasar untuk wave divider
        <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
            <Head title="Semua Wisata" />
            <Navigation />
            <HeroSectionSecond
                title="Semua Destinasi Wisata"
                description="Temukan dan jelajahi setiap sudut keindahan yang ditawarkan oleh Desa Sungai Deras."
            />

            <main>
                {/* Section konten dengan latar hangat pantulan senja */}
                <section id="semua-wisata" className="py-20 md:py-28 bg-amber-100/50 dark:bg-black/20">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 max-w-lg mx-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau deskripsi wisata..."
                                    className="pl-10 h-12 text-base border-slate-300 focus-visible:ring-amber-500 dark:border-gray-700 dark:bg-gray-800"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {tourismSpots.data.length === 0 && (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold mb-2">Wisata Tidak Ditemukan</h3>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Coba gunakan kata kunci lain untuk menemukan destinasi yang Anda cari.
                                </p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {tourismSpots.data.map((spot) => (
                                <Card key={spot.id} className="group bg-white dark:bg-gray-800 border-slate-200/50 dark:border-gray-700/50 hover:border-amber-500/30 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
                                    <CardHeader className="p-0">
                                        <div className="relative overflow-hidden aspect-video">
                                            <ImageWithFallback src={getImageUrl(spot.galleries[0]?.path)} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <Badge className="absolute top-3 left-3 bg-teal-100 text-teal-800 border border-teal-200/80 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800">
                                                {spot.category.name}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 flex-grow">
                                        <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">{spot.name}</h3>
                                        <div className="flex items-start text-sm text-slate-500 dark:text-slate-400 mb-3">
                                            <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                                            <span>{spot.address}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {spot.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0 mt-auto">
                                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600" onClick={() => setSelectedSpot(spot)}>
                                            Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination yang sudah diperbaiki */}
                        {tourismSpots.data.length > 0 && links.length > 3 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious asChild disabled={!prevLink.url}>
                                            <Link href={prevLink.url || '#'} preserveState preserveScroll className="flex items-center gap-1 hover:bg-amber-100">
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="hidden sm:inline">Sebelumnya</span>
                                            </Link>
                                        </PaginationPrevious>
                                    </PaginationItem>

                                    {pageLinks.map((link, index) => (
                                        link.label.includes('...')
                                        ? <PaginationItem key={index}><span className="px-4 py-2">...</span></PaginationItem>
                                        : (
                                            <PaginationItem key={index}>
                                                <PaginationLink asChild isActive={link.active} className={link.active ? 'bg-amber-600 text-white hover:bg-amber-700 hover:text-white' : 'hover:bg-amber-100'}>
                                                    <Link href={link.url || '#'} preserveState preserveScroll>{link.label}</Link>
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext asChild disabled={!nextLink.url}>
                                            <Link href={nextLink.url || '#'} preserveState preserveScroll className="flex items-center gap-1 hover:bg-amber-100">
                                                <span className="hidden sm:inline">Berikutnya</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </PaginationNext>
                                    </PaginationItem>
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
