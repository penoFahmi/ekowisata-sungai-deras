import { Umkm } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User, X, Share2, Map } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '../ui/button';

interface UmkmDetailModalProps {
    umkm: Umkm | null;
    isOpen: boolean;
    onClose: () => void;
    onNavigate?: (umkm: Umkm) => void;
}

export function UmkmDetailModal({ umkm, isOpen, onClose, onNavigate }: UmkmDetailModalProps) {
    if (!umkm) return null;

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x600/png?text=Produk';
    };

    const handleWhatsApp = () => {
        if (umkm.phone_number) {
            const phoneNumber = umkm.phone_number.replace(/[^0-9]/g, '');
            const internationalNumber = phoneNumber.startsWith('0') ? `62${phoneNumber.substring(1)}` : phoneNumber;
            window.open(`https://wa.me/${internationalNumber}?text=Halo,%20saya%20tertarik%20dengan%20produk%20dari%20${umkm.name}.`, '_blank');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: umkm.name,
                text: `Cek produk dari ${umkm.name}, UMKM unggulan Desa Sungai Deras!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert("Fitur bagikan tidak didukung di browser ini.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95%] p-0 flex flex-col md:flex-row max-h-[90vh] overflow-hidden sm:max-w-2xl md:max-w-4xl xl:max-w-6xl rounded-xl">
                {/* Image Section */}
                <div className="relative md:w-1/2 bg-slate-900 flex items-center justify-center overflow-hidden">
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
                            {umkm.galleries && umkm.galleries.length > 0 ? (
                                umkm.galleries.map((gallery, index) => (
                                    <CarouselItem key={index}>
                                        <div className="w-full aspect-square md:h-full">
                                            <ImageWithFallback src={getImageUrl(gallery.path)} alt={`${umkm.name} - Gambar ${index + 1}`} className="w-full h-full object-contain" />
                                        </div>
                                    </CarouselItem>
                                ))
                            ) : (
                                <CarouselItem>
                                    <div className="w-full aspect-square md:h-full">
                                        <ImageWithFallback src={getImageUrl(undefined)} alt={umkm.name} className="w-full h-full object-contain" />
                                    </div>
                                </CarouselItem>
                            )}
                        </CarouselContent>
                        {umkm.galleries && umkm.galleries.length > 1 && (
                            <>
                                <CarouselPrevious className="absolute left-4 z-10 text-white bg-black/40 hover:bg-black/60 border-none" />
                                <CarouselNext className="absolute right-4 z-10 text-white bg-black/40 hover:bg-black/60 border-none" />
                            </>
                        )}
                    </Carousel>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 flex-shrink-0 bg-white dark:bg-slate-800 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        <DialogHeader>
                            <Badge className="w-fit mb-3 text-sm bg-sky-100 text-sky-800 border-none dark:bg-sky-900/50 dark:text-sky-300">
                                {umkm.category.name}
                            </Badge>
                            <DialogTitle className="text-2xl md:text-3xl font-bold text-teal-900 dark:text-teal-200">
                                {umkm.name}
                            </DialogTitle>
                        </DialogHeader>

                        {/* Info Pemilik & Lokasi */}
                        <div className="space-y-3 text-sm text-stone-600 dark:text-stone-400 border-t border-b border-stone-200 dark:border-slate-700 py-4">
                            <div className="flex items-center"><User className="w-4 h-4 mr-3 flex-shrink-0 text-teal-700" /><span>Pemilik: <strong>{umkm.owner_name}</strong></span></div>
                            <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 flex-shrink-0 text-teal-700" /><span>{umkm.address}</span></div>
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-slate-200">Deskripsi Produk</h3>
                            <DialogDescription asChild>
                                <div
                                    className="prose prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-400"
                                    dangerouslySetInnerHTML={{ __html: umkm.description }}
                                />
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="p-4 border-t border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-auto grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full border-stone-300 dark:border-slate-600" onClick={() => onNavigate?.(umkm)}>
                            <Map className="mr-2 h-4 w-4" />
                            Peta
                        </Button>
                        <Button onClick={handleWhatsApp} disabled={!umkm.phone_number} className="w-full bg-green-500 hover:bg-green-600 text-white">
                            <Phone className="mr-2 h-4 w-4" /> WhatsApp
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
