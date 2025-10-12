import { TourismSpot } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, X, Map, Share2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';

interface WisataDetailModalProps {
    spot: TourismSpot | null;
    isOpen: boolean;
    onClose: () => void;
    // Fungsi baru untuk menangani klik tombol "Lihat di Peta"
    onNavigate?: (spot: TourismSpot) => void;
}

export function WisataDetailModal({ spot, isOpen, onClose, onNavigate }: WisataDetailModalProps) {
    if (!spot) return null;

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/1200x800/png?text=Gambar+Wisata';
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: spot.name,
                text: `Kunjungi ${spot.name}, destinasi wisata menarik di Desa Sungai Deras!`,
                url: window.location.href, // Anda bisa ganti dengan URL spesifik wisata jika ada
            }).catch(console.error);
        } else {
            // Fallback untuk browser yang tidak mendukung Web Share API
            alert("Fitur bagikan tidak didukung di browser ini. Silakan salin URL secara manual.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95%] p-0 flex flex-col md:flex-row max-h-[90vh] overflow-hidden sm:max-w-2xl md:max-w-4xl xl:max-w-6xl rounded-xl">
                {/* Image Section */}
                <div className="relative md:w-3/5 xl:w-2/3 bg-slate-900 flex items-center justify-center overflow-hidden">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="absolute top-3 right-3 z-50 h-9 w-9 p-0 rounded-full bg-black/40 hover:bg-black/60 text-white hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                        <span className="sr-only">Tutup</span>
                    </Button>
                     <Carousel className="w-full h-full">
                        <CarouselContent>
                            {spot.galleries && spot.galleries.length > 0 ? (
                                spot.galleries.map((gallery, index) => (
                                    <CarouselItem key={index}>
                                        <div className="w-full h-64 md:h-[600px] xl:h-[700px]">
                                            <ImageWithFallback
                                                src={getImageUrl(gallery.path)}
                                                alt={`${spot.name} - Gambar ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))
                            ) : (
                                <CarouselItem>
                                     <div className="w-full h-64 md:h-[600px] xl:h-[700px]">
                                        <ImageWithFallback src={getImageUrl(undefined)} alt={spot.name} className="w-full h-full object-contain" />
                                    </div>
                                </CarouselItem>
                            )}
                        </CarouselContent>
                        {spot.galleries && spot.galleries.length > 1 && (
                            <>
                                <CarouselPrevious className="absolute left-4 z-10 text-white bg-black/40 hover:bg-black/60 border-none" />
                                <CarouselNext className="absolute right-4 z-10 text-white bg-black/40 hover:bg-black/60 border-none" />
                            </>
                        )}
                    </Carousel>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-2/5 xl:w-1/3 flex-shrink-0 bg-white dark:bg-slate-800 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        <DialogHeader>
                            <Badge className="w-fit mb-3 text-sm bg-sky-100 text-sky-800 border-none dark:bg-sky-900/50 dark:text-sky-300">
                                {spot.category.name}
                            </Badge>
                            <DialogTitle className="text-2xl md:text-3xl font-bold text-teal-900 dark:text-teal-200">
                                {spot.name}
                            </DialogTitle>
                            <div className="flex items-center text-md text-stone-600 dark:text-stone-400 pt-2">
                                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 text-teal-700 dark:text-teal-400" />
                                <span>{spot.address}</span>
                            </div>
                        </DialogHeader>

                        <div className="border-t border-stone-200 dark:border-slate-700 pt-6">
                            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-slate-200">Tentang Tempat Ini</h3>
                            <DialogDescription asChild>
                                <div
                                    className="prose prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-400"
                                    dangerouslySetInnerHTML={{ __html: spot.description }}
                                />
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Action Buttons (Sticky Footer) */}
                    <div className="p-4 border-t border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-auto">
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 border-stone-300 dark:border-slate-600" onClick={handleShare}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Bagikan
                            </Button>
                            <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => onNavigate?.(spot)}>
                                <Map className="mr-2 h-4 w-4" />
                                Lihat di Peta
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
