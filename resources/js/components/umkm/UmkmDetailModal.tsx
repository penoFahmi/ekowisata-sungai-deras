import { Umkm } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '../ui/button';

interface UmkmDetailModalProps {
    umkm: Umkm | null;
    isOpen: boolean;
    onClose: () => void;
}

export function UmkmDetailModal({ umkm, isOpen, onClose }: UmkmDetailModalProps) {
    if (!umkm) return null;

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Produk';
    };

    const handleWhatsApp = () => {
        if (umkm.phone_number) {
            // Format nomor telepon ke format internasional tanpa spasi atau simbol
            const phoneNumber = umkm.phone_number.replace(/[^0-9]/g, '');
            const internationalNumber = phoneNumber.startsWith('0') ? `62${phoneNumber.substring(1)}` : phoneNumber;
            window.open(`https://wa.me/${internationalNumber}`, '_blank');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl p-0">
                <div className="grid md:grid-cols-2">
                    {/* Image Carousel */}
                    <div className="relative">
                        <Carousel className="w-full rounded-l-lg overflow-hidden">
                            <CarouselContent>
                                {umkm.galleries && umkm.galleries.length > 0 ? (
                                    umkm.galleries.map((gallery, index) => (
                                        <CarouselItem key={index}>
                                            <div className="aspect-square">
                                                <ImageWithFallback src={getImageUrl(gallery.path)} alt={`${umkm.name} - Gambar ${index + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        </CarouselItem>
                                    ))
                                ) : (
                                    <CarouselItem>
                                        <div className="aspect-square">
                                            <ImageWithFallback src={getImageUrl(undefined)} alt={umkm.name} className="w-full h-full object-cover" />
                                        </div>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-4" />
                            <CarouselNext className="absolute right-4" />
                        </Carousel>
                    </div>

                    {/* Details */}
                    <div className="p-6 flex flex-col">
                        <Badge variant="secondary" className="w-fit mb-2">{umkm.category.name}</Badge>
                        <DialogTitle className="text-2xl font-bold mb-2">{umkm.name}</DialogTitle>
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center"><User className="w-4 h-4 mr-2" /><span>Pemilik: {umkm.owner_name}</span></div>
                            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /><span>{umkm.address}</span></div>
                        </div>
                        <DialogDescription className="text-base text-foreground flex-grow overflow-y-auto mb-4">{umkm.description}</DialogDescription>
                        <Button onClick={handleWhatsApp} disabled={!umkm.phone_number} className="w-full mt-auto">
                            <Phone className="w-4 h-4 mr-2" /> Hubungi via WhatsApp
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
