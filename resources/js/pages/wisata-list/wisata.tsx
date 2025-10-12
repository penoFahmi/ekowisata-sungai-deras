import { Link, Head, usePage, router } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, TourismSpot } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { route } from 'ziggy-js';
import { WisataDetailModal } from '@/components/wisata/WisataDetailModal';
import { HeroSectionSecond } from '@/components/landing-page/hero-section-second';
import { motion } from 'framer-motion';

interface WisataIndexProps extends PageProps {
    tourismSpots: PaginatedResponse<TourismSpot>;
    filters: {
        search?: string;
    }
}

// Konfigurasi animasi untuk container dan kartu
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

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

    const { links } = tourismSpots;
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        <div className="min-h-screen bg-stone-100 dark:bg-slate-900">
            <Head title="Semua Wisata" />
            <Navigation />
            <HeroSectionSecond
                title="Semua Destinasi Wisata"
                description="Temukan dan jelajahi setiap sudut keindahan yang ditawarkan oleh Desa Sungai Deras."
            />

            <main>
                <section id="semua-wisata" className="py-20 md:py-28 bg-white dark:bg-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 max-w-lg mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau deskripsi wisata..."
                                    className="pl-12 h-14 text-base bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700 focus-visible:ring-amber-500 rounded-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {tourismSpots.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Search className="mx-auto h-12 w-12 text-stone-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-slate-200">Wisata Tidak Ditemukan</h3>
                                <p className="text-stone-500 dark:text-stone-400">
                                    Coba gunakan kata kunci lain untuk menemukan destinasi yang Anda cari.
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                            >
                                {tourismSpots.data.map((spot) => (
                                    <motion.div variants={cardVariants} key={spot.id}>
                                        <Card className="group bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-amber-500/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 h-full">
                                            <CardHeader className="p-0">
                                                <div className="relative overflow-hidden aspect-video">
                                                    <ImageWithFallback src={getImageUrl(spot.galleries?.[0]?.path)} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                    <Badge className="absolute top-3 left-3 bg-sky-100 text-sky-800 border-none dark:bg-sky-900/50 dark:text-sky-300">
                                                        {spot.category.name}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6 flex-grow">
                                                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-slate-200">{spot.name}</h3>
                                                <div className="flex items-start text-sm text-stone-500 dark:text-stone-400 mb-3">
                                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-teal-700 dark:text-teal-400" />
                                                    <span>{spot.address}</span>
                                                </div>
                                                <p className="text-stone-600 dark:text-stone-400 line-clamp-2">
                                                    {spot.description}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="p-6 pt-0 mt-auto">
                                                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setSelectedSpot(spot)}>
                                                    Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {tourismSpots.data.length > 0 && links.length > 3 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <Link href={prevLink.url || '#'} preserveState preserveScroll className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-amber-100/50 dark:hover:bg-slate-700 ${!prevLink.url ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="hidden sm:inline">Sebelumnya</span>
                                        </Link>
                                    </PaginationItem>

                                    {pageLinks.map((link, index) => (
                                        link.label.includes('...')
                                        ? <PaginationItem key={index}><span className="px-4 py-2">...</span></PaginationItem>
                                        : (
                                            <PaginationItem key={index}>
                                                <Link href={link.url || '#'} preserveState preserveScroll className={`px-4 py-2 rounded-md ${link.active ? 'bg-amber-600 text-white hover:bg-amber-700' : 'hover:bg-amber-100/50 dark:hover:bg-slate-700'}`}>{link.label}</Link>
                                            </PaginationItem>
                                        )
                                    ))}

                                    <PaginationItem>
                                         <Link href={nextLink.url || '#'} preserveState preserveScroll className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-amber-100/50 dark:hover:bg-slate-700 ${!nextLink.url ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <span className="hidden sm:inline">Berikutnya</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
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
