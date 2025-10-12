import { TourismSpot } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';

interface WisataDetailModalProps {
    spot: TourismSpot | null;
    isOpen: boolean;
    onClose: () => void;
}

export function WisataDetailModal({ spot, isOpen, onClose }: WisataDetailModalProps) {
    if (!spot) return null;

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/800x600/png?text=Gambar+Wisata';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Menggunakan bg-stone-50 agar konsisten dengan warna Card */}
            <DialogContent className="max-w-5xl w-full p-0 gap-0 rounded-xl overflow-hidden shadow-2xl bg-stone-50 dark:bg-gray-800">
                {/* Tombol Close sudah bagus, tidak perlu diubah */}
                <Button
                    onClick={onClose}
                    variant="ghost"
                    className="absolute top-3 right-3 z-50 h-9 w-9 p-0 rounded-full bg-black/40 hover:bg-black/60 text-white hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Tutup</span>
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-5 max-h-[90vh] md:h-[600px]">
                    {/* Kolom Gambar Carousel */}
                    <div className="relative md:col-span-3 h-64 md:h-full bg-stone-200 dark:bg-gray-700">
                        <Carousel className="w-full h-full">
                            <CarouselContent>
                                {spot.galleries && spot.galleries.length > 0 ? (
                                    spot.galleries.map((gallery, index) => (
                                        <CarouselItem key={index}>
                                            <div className="w-full h-64 md:h-[600px]">
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
                                        <div className="w-full h-64 md:h-[600px]">
                                            <ImageWithFallback src={getImageUrl(undefined)} alt={spot.name} className="w-full h-full object-cover" />
                                        </div>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            {spot.galleries && spot.galleries.length > 1 && (
                                <>
                                    {/* Tombol Navigasi Carousel sudah bagus, tidak perlu diubah */}
                                    <CarouselPrevious className="absolute left-4 z-10 text-white bg-black/40 hover:bg-black/60 border-none" />
                                    <CarouselNext className="absolute right-4 z-10 text-white bg-black/40 hover:bg-black/60 border-none" />
                                </>
                            )}
                        </Carousel>
                    </div>

                    {/* Kolom Detail Teks */}
                    {/* Hapus bg-card dari sini karena sudah diatur di DialogContent induk */}
                    <div className="md:col-span-2 p-8 flex flex-col overflow-hidden">
                        <DialogHeader className="flex-shrink-0 pb-4 border-b border-slate-200 dark:border-gray-700">
                            {/* DARI: variant="secondary" */}
                            {/* MENJADI: Badge dengan warna Hijau Teal ("Air Jernih") */}
                            <Badge className="w-fit mb-3 text-sm bg-teal-100 text-teal-800 border border-teal-200/80 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800">
                                {spot.category.name}
                            </Badge>
                            <DialogTitle className="text-3xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-slate-100">
                                {spot.name}
                            </DialogTitle>
                            <div className="flex items-center text-md text-slate-500 dark:text-slate-400 pt-3">
                                {/* DARI: text-primary */}
                                {/* MENJADI: Ikon dengan warna Hijau Teal */}
                                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                                <span>{spot.address}</span>
                            </div>
                        </DialogHeader>

                        <div className="mt-6 flex-grow overflow-y-auto pr-2">
                            <DialogDescription asChild>
                                {/* DARI: prose-slate */}
                                {/* MENJADI: prose-stone yang lebih hangat */}
                                <div className="prose prose-stone dark:prose-invert max-w-none">
                                    <p>{spot.description}</p>
                                </div>
                            </DialogDescription>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
