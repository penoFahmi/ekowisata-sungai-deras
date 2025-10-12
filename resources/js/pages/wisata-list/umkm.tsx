import { Link, Head, usePage, router } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, Umkm, Category } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { route } from 'ziggy-js';
import { UmkmDetailModal } from '@/components/umkm/UmkmDetailModal';
import { HeroSectionSecond } from '@/components/landing-page/hero-section-second';
import { motion } from 'framer-motion';

interface UmkmIndexProps extends PageProps {
    umkms: PaginatedResponse<Umkm>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
    }
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

export default function UmkmIndex() {
    const { umkms, categories, filters } = usePage<UmkmIndexProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);
    const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=UMKM';
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        router.get(route('umkm-list.index'), { search: debouncedSearchTerm, category: selectedCategory }, { preserveState: true, replace: true, preserveScroll: true });
    }, [debouncedSearchTerm, selectedCategory]);

    const { links } = umkms;
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        <div className="min-h-screen bg-stone-100 dark:bg-slate-900">
            <Head title="Direktori UMKM" />
            <Navigation />
            <HeroSectionSecond
                title="Direktori UMKM"
                description="Dukung ekonomi lokal dengan menemukan produk dan jasa terbaik dari Desa Sungai Deras."
            />
            <main>
                <section className="py-20 md:py-28 bg-white dark:bg-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-4 gap-x-12 gap-y-8 max-w-7xl mx-auto">

                            <aside className="lg:col-span-1">
                                <div className="p-6 bg-stone-50 dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-4">
                                         <Filter className="w-5 h-5 text-teal-800 dark:text-teal-300" />
                                        <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-200">Filter Kategori</h3>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            onClick={() => setSelectedCategory('')}
                                            variant={!selectedCategory ? 'default' : 'outline'}
                                            className={`justify-start w-full text-left ${!selectedCategory ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-white dark:bg-slate-800 border-stone-300 dark:border-slate-600'}`}
                                        >
                                            Semua Kategori
                                        </Button>
                                        {categories.map((category) => (
                                            <Button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.slug)}
                                                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                                                className={`justify-start w-full text-left ${selectedCategory === category.slug ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-white dark:bg-slate-800 border-stone-300 dark:border-slate-600'}`}
                                            >
                                                {category.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            <div className="lg:col-span-3">
                                <div className="mb-8">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                        <Input type="search" placeholder="Cari nama UMKM atau produk..." className="pl-12 h-14 text-base bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700 focus-visible:ring-amber-500 rounded-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    </div>
                                </div>

                                {umkms.data.length === 0 ? (
                                    <div className="text-center py-16 border-2 border-dashed border-stone-300 dark:border-slate-700 rounded-lg">
                                        <Search className="mx-auto h-12 w-12 text-stone-400 mb-4" />
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-slate-200">UMKM Tidak Ditemukan</h3>
                                        <p className="text-stone-500 dark:text-stone-400">Coba gunakan kata kunci atau filter lain.</p>
                                    </div>
                                ) : (
                                    <>
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid md:grid-cols-2 gap-8 mb-16"
                                        >
                                            {umkms.data.map((item) => (
                                                <motion.div variants={cardVariants} key={item.id}>
                                                    <Card className="group bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-amber-500/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 h-full">
                                                        <CardHeader className="p-0">
                                                            <div className="relative overflow-hidden aspect-video">
                                                                <ImageWithFallback src={getImageUrl(item.galleries[0]?.path)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                                <Badge className="absolute top-3 left-3 bg-sky-100 text-sky-800 border-none dark:bg-sky-900/50 dark:text-sky-300">{item.category.name}</Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-6 flex-grow">
                                                            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-slate-200">{item.name}</h3>
                                                            <div className="flex items-start text-sm text-stone-500 dark:text-stone-400 mb-3">
                                                                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-teal-700 dark:text-teal-400" />
                                                                <span>{item.address}</span>
                                                            </div>
                                                            <p className="text-stone-600 dark:text-stone-400 line-clamp-2">{item.description}</p>
                                                        </CardContent>
                                                        <CardFooter className="p-6 pt-0 mt-auto">
                                                            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setSelectedUmkm(item)}>
                                                                Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        {links.length > 3 && (
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <UmkmDetailModal umkm={selectedUmkm} isOpen={!!selectedUmkm} onClose={() => setSelectedUmkm(null)} />
            <Footer />
        </div>
    );
}
