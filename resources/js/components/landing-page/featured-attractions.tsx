import { TourismSpot } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface FeaturedAttractionsProps {
    tourismSpots: TourismSpot[];
}

export function FeaturedAttractions({ tourismSpots }: FeaturedAttractionsProps) {
    const getImageUrl = (path: string) => {
        return path ? `/storage/${path}` : '/default-image.jpg';
    };

    return (
        <section id="wisata" className="container py-12 md:py-24">
            <div className="mx-auto flex max-w-5xl flex-col items-center space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Wisata Unggulan</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Jelajahi keindahan alam dan budaya Desa Sungai Deras yang mempesona.
                </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {tourismSpots.map((spot) => (
                    <Card key={spot.id} className="overflow-hidden">
                        <CardHeader className="p-0">
                            <img
                                src={getImageUrl(spot.galleries[0]?.path)}
                                alt={spot.name}
                                className="h-48 w-full object-cover"
                            />
                        </CardHeader>
                        <CardContent className="p-4">
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
