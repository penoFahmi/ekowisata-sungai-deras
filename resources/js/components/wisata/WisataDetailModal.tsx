import { TourismSpot } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface WisataDetailModalProps {
    spot: TourismSpot | null;
    isOpen: boolean;
    onClose: () => void;
}

export function WisataDetailModal({ spot, isOpen, onClose }: WisataDetailModalProps) {
    if (!spot) return null;

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Gambar';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl p-0">
                <div className="grid md:grid-cols-2">
                    {/* Image Carousel */}
                    <div className="relative">
                        <Carousel className="w-full rounded-l-lg overflow-hidden">
                            <CarouselContent>
                                {spot.galleries && spot.galleries.length > 0 ? (
                                    spot.galleries.map((gallery, index) => (
                                        <CarouselItem key={index}>
                                            <div className="aspect-square">
                                                <ImageWithFallback
                                                    src={getImageUrl(gallery.path)}
                                                    alt={`${spot.name} - Gambar ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))
                                ) : (
                                    <CarouselItem>
                                        <div className="aspect-square">
                                            <ImageWithFallback src={getImageUrl(undefined)} alt={spot.name} className="w-full h-full object-cover" />
                                        </div>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-4" />
                            <CarouselNext className="absolute right-4" />
                        </Carousel>
                    </div>

                    {/* Spot Details */}
                    <div className="p-6 flex flex-col">
                        <DialogHeader>
                            <Badge variant="secondary" className="w-fit mb-2">{spot.category.name}</Badge>
                            <DialogTitle className="text-2xl font-bold">{spot.name}</DialogTitle>
                            <div className="flex items-center text-sm text-muted-foreground pt-1">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{spot.address}</span>
                            </div>
                        </DialogHeader>
                        <DialogDescription className="mt-4 text-base text-foreground flex-grow overflow-y-auto">{spot.description}</DialogDescription>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
