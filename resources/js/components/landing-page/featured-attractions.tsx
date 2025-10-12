import { Link } from "@inertiajs/react";
import { TourismSpot } from "@/types";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mountain, MapPin, Eye } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface FeaturedAttractionsProps {
    tourismSpots: TourismSpot[];
    onSelectSpot: (spot: TourismSpot) => void;
}

export function FeaturedAttractions({ tourismSpots, onSelectSpot }: FeaturedAttractionsProps) {
    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Wisata';
    };

    return (
        <section id="wisata-unggulan" className="py-24 bg-stone-100 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex justify-center items-center gap-3 mb-4 bg-sky-100 text-teal-900 px-4 py-2 rounded-full dark:bg-sky-900/40 dark:text-sky-200">
                        <Mountain className="w-6 h-6" />
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Wisata Unggulan
                        </h2>
                    </div>
                    <p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
                        Jelajahi keindahan alam dan budaya Desa Sungai Deras yang mempesona melalui destinasi pilihan kami.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tourismSpots.map((spot) => (
                        <Card
                            key={spot.id}
                            className="group bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-amber-500/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
                        >
                            <CardHeader className="p-0">
                                <div className="relative overflow-hidden aspect-[16/10]">
                                    <ImageWithFallback
                                        src={getImageUrl(spot.galleries?.[0]?.path)}
                                        alt={spot.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <Badge className="absolute top-4 left-4 text-sm bg-sky-100 text-sky-800 border border-sky-200/80 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-800">
                                        {spot.category.name}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 flex-grow flex-col">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-3 h-14 line-clamp-2">{spot.name}</h3>
                                <div className="flex items-start text-sm text-stone-500 dark:text-stone-400 mb-4">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-teal-700 dark:text-teal-400" />
                                    <span className="line-clamp-1">{spot.address}</span>
                                </div>
                                <p className="text-stone-600 dark:text-stone-400 line-clamp-3 flex-grow">
                                    {spot.description}
                                </p>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 mt-auto">
                                <Button onClick={() => onSelectSpot(spot)} className="w-full font-semibold bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Lihat Detail
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Button asChild size="lg" className="rounded-full px-8 py-6 text-base font-bold bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600">
                        <Link href={route('wisata-list.index')}>
                            Lihat Semua Wisata <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
