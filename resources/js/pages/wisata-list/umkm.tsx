import { Link, Head, usePage, router } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, Umkm, Category } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { route } from 'ziggy-js';
import { UmkmDetailModal } from '@/components/umkm/UmkmDetailModal';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HeroSectionSecond } from '@/components/landing-page/hero-section-second';
import { WaveDivider } from '@/components/landing-page/WaveDivider'; // <-- Pastikan path ini benar

interface UmkmIndexProps extends PageProps {
    umkms: PaginatedResponse<Umkm>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
    }
}

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

    // Memisahkan link pagination
    const { links } = umkms;
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-gray-900">
            <Head title="Direktori UMKM" />
            <Navigation />
            <HeroSectionSecond
                title="Direktori UMKM"
                description="Dukung ekonomi lokal dengan menemukan produk dan jasa terbaik dari Desa Sungai Deras."
            />
            <main>
                <section className="py-20 md:py-28 bg-amber-100/50 dark:bg-black/20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-4 gap-12 max-w-7xl mx-auto">

                            {/* ====== KOLOM FILTER (SIDEBAR) ====== */}
                            <aside className="lg:col-span-1">
                                <div className="sticky top-24 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-gray-700/50">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800 dark:text-slate-200">
                                        <Filter className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                                        Filter Kategori
                                    </h3>
                                    <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <div className="flex items-center space-x-2 py-2">
                                            <RadioGroupItem value="" id="cat-all" className="text-amber-600 border-gray-400 focus:ring-amber-500" />
                                            <Label htmlFor="cat-all" className="cursor-pointer">Semua</Label>
                                        </div>
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="flex items-center space-x-2 py-2">
                                                <RadioGroupItem value={String(cat.id)} id={`cat-${cat.id}`} className="text-amber-600 border-gray-400 focus:ring-amber-500"/>
                                                <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">{cat.name}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </aside>

                            {/* ====== KOLOM HASIL PENCARIAN ====== */}
                            <div className="lg:col-span-3">
                                <div className="mb-8">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input type="search" placeholder="Cari nama UMKM atau produk..." className="pl-10 h-12 text-base border-slate-300 focus-visible:ring-amber-500 dark:border-gray-700 dark:bg-gray-800" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    </div>
                                </div>

                                {umkms.data.length === 0 ? (
                                    <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-lg">
                                        <h3 className="text-xl font-semibold mb-2">UMKM Tidak Ditemukan</h3>
                                        <p className="text-slate-500 dark:text-slate-400">Coba gunakan kata kunci atau filter lain.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                                            {umkms.data.map((item) => (
                                                <Card key={item.id} className="group bg-white dark:bg-gray-800 border-slate-200/50 dark:border-gray-700/50 hover:border-amber-500/30 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
                                                    <CardHeader className="p-0">
                                                        <div className="relative overflow-hidden aspect-video">
                                                            <ImageWithFallback src={getImageUrl(item.galleries[0]?.path)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                            <Badge className="absolute top-3 left-3 bg-teal-100 text-teal-800 border border-teal-200/80 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800">{item.category.name}</Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-6 flex-grow">
                                                        <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">{item.name}</h3>
                                                        <div className="flex items-start text-sm text-slate-500 dark:text-slate-400 mb-3">
                                                            <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                                                            <span>{item.address}</span>
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{item.description}</p>
                                                    </CardContent>
                                                    <CardFooter className="p-6 pt-0 mt-auto">
                                                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600" onClick={() => setSelectedUmkm(item)}>
                                                            Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>

                                        {links.length > 3 && (
                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem><PaginationPrevious asChild disabled={!prevLink.url}><Link href={prevLink.url || '#'} preserveState preserveScroll className="flex items-center gap-1 hover:bg-amber-100"><ChevronLeft className="h-4 w-4" /><span className="hidden sm:inline">Sebelumnya</span></Link></PaginationPrevious></PaginationItem>
                                                    {pageLinks.map((link, index) => ( link.label.includes('...') ? <PaginationItem key={index}><span className="px-4 py-2">...</span></PaginationItem> : <PaginationItem key={index}><PaginationLink asChild isActive={link.active} className={link.active ? 'bg-amber-600 text-white hover:bg-amber-700 hover:text-white' : 'hover:bg-amber-100'}><Link href={link.url || '#'} preserveState preserveScroll>{link.label}</Link></PaginationLink></PaginationItem> ))}
                                                    <PaginationItem><PaginationNext asChild disabled={!nextLink.url}><Link href={nextLink.url || '#'} preserveState preserveScroll className="flex items-center gap-1 hover:bg-amber-100"><span className="hidden sm:inline">Berikutnya</span><ChevronRight className="h-4 w-4" /></Link></PaginationNext></PaginationItem>
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
