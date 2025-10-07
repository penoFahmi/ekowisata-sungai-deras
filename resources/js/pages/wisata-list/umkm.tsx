import { Link, Head, usePage, router } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, Umkm, Category } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Search, Store } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { route } from 'ziggy-js';
import { UmkmDetailModal } from '@/components/umkm/UmkmDetailModal';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HeroSectionSecond } from '@/components/landing-page/hero-section-second';

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

    return (
        <div className="bg-background text-foreground">
            <Head title="Direktori UMKM" />
            <Navigation />
            <HeroSectionSecond />
            <main>
                <section className="py-20 md:py-28">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="flex justify-center items-center gap-2 mb-4">
                                <Store className="w-8 h-8 text-primary" />
                                <h1 className="text-4xl md:text-5xl font-bold">Direktori UMKM</h1>
                            </div>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Dukung ekonomi lokal dengan menemukan produk dan jasa terbaik dari Desa Sungai Deras.
                            </p>
                        </div>

                        <div className="grid gap-12 max-w-7xl mx-auto">

                            {/* Results Section */}
                            <div className="lg:col-span-3">
                                <div className="mb-8">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input type="search" placeholder="Cari nama UMKM atau produk..." className="pl-10 h-12 text-base" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    </div>
                                </div>

                                {umkms.data.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                        <h3 className="text-xl font-semibold mb-2">UMKM Tidak Ditemukan</h3>
                                        <p className="text-muted-foreground">Coba gunakan kata kunci atau filter lain.</p>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-3 gap-8 mb-12">
                                    {umkms.data.map((item) => (
                                        <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                                            <CardHeader className="p-0">
                                                <div className="relative overflow-hidden aspect-video">
                                                    <ImageWithFallback src={getImageUrl(item.galleries[0]?.path)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <Badge variant="secondary" className="absolute top-3 left-3">{item.category.name}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6 flex-grow">
                                                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                                                <div className="flex items-start text-sm text-muted-foreground mb-3">
                                                    <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                                                    <span>{item.address}</span>
                                                </div>
                                                <p className="text-muted-foreground line-clamp-2">{item.description}</p>
                                            </CardContent>
                                            <CardFooter className="p-6 pt-0">
                                                <Button className="w-full" onClick={() => setSelectedUmkm(item)}>
                                                    Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>

                                {umkms.data.length > 0 && (
                                    <Pagination>
                                        <PaginationContent>
                                            {umkms.links.map((link, index) => (
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
                        </div>
                    </div>
                </section>
            </main>
            <UmkmDetailModal umkm={selectedUmkm} isOpen={!!selectedUmkm} onClose={() => setSelectedUmkm(null)} />
            <Footer />
        </div>
    );
}
