import { Link, Head, usePage } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, TourismSpot } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Mountain } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

interface WisataIndexProps extends PageProps {
    tourismSpots: PaginatedResponse<TourismSpot>;
}

export default function WisataIndex() {
    const { tourismSpots } = usePage<WisataIndexProps>().props;

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Wisata';
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Semua Wisata" />
            <Navigation />
            <main className="pt-24 pb-12">
                <section id="semua-wisata" className="py-10 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="flex justify-center items-center gap-2 mb-4">
                                <Mountain className="w-8 h-8 text-primary" />
                                <h1 className="text-4xl md:text-5xl font-bold">
                                    Semua Destinasi Wisata
                                </h1>
                            </div>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Temukan dan jelajahi setiap sudut keindahan yang ditawarkan oleh Desa Sungai Deras.
                            </p>
                        </div>

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
                                        <Button asChild className="w-full">
                                            <Link href={route('wisata-list.show', spot.id)}>Lihat Detail <ArrowRight className="w-4 h-4 ml-2" /></Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination>
                            <PaginationContent>
                                {tourismSpots.links.map((link, index) => (
                                    <PaginationItem key={index} className={!link.url ? 'opacity-50 pointer-events-none' : ''}>
                                        <PaginationLink asChild isActive={link.active}>
                                            <Link href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
