import { Link } from "@inertiajs/react";
import { TourismSpot } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { ArrowRight, Mountain, MapPin } from "lucide-react";

interface FeaturedAttractionsProps {
    tourismSpots: TourismSpot[];
}

export function FeaturedAttractions({ tourismSpots }: FeaturedAttractionsProps) {
    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Wisata';
    };

    const handleViewOnMap = () => {
        const element = document.querySelector('#map');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="wisata-unggulan" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Mountain className="w-6 h-6 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Wisata Unggulan
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Jelajahi keindahan alam dan budaya Desa Sungai Deras yang mempesona.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tourismSpots.map((spot) => (
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
                                <div className="flex w-full space-x-2">
                                    <Button asChild variant="outline" className="flex-1">
                                        <Link href={`/wisata/${spot.id}`}>Lihat Detail</Link>
                                    </Button>
                                    <Button className="flex-1" onClick={handleViewOnMap}>
                                        Lihat di Peta
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button asChild size="lg">
                        <Link href="/wisata">Lihat Semua Wisata <ArrowRight className="w-5 h-5 ml-2" /></Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
