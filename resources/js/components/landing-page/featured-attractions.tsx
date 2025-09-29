import { TourismSpot } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface FeaturedAttractionsProps {
    tourismSpots: TourismSpot[];
}

export function FeaturedAttractions({ tourismSpots }: FeaturedAttractionsProps) {
    const getImageUrl = (path: string) => {
        return path ? `/storage/${path}` : '/default-image.jpg';
    };

    return (
        <section id="wisata" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Wisata Unggulan
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Jelajahi keindahan alam dan budaya Desa Sungai Deras yang mempesona.
                </p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {tourismSpots.map((spot) => (
                    <Card key={spot.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <CardHeader key={spot.id} className="p-0">
                            <div className="relative overflow-hidden">
                                <ImageWithFallback
                                    src={getImageUrl(spot.galleries[0]?.path)}
                                    alt={spot.name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Badge variant="outline" className="mb-2">{spot.category.name}</Badge>
                            <CardTitle className="text-lg">{spot.name}</CardTitle>
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                {spot.description}
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <a href="#" className="text-sm font-semibold text-primary hover:underline">
                                Lihat Detail &rarr;
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
