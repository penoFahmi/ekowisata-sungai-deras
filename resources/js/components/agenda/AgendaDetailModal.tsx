import { Agenda } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface AgendaDetailModalProps {
    agenda: Agenda | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AgendaDetailModal({ agenda, isOpen, onClose }: AgendaDetailModalProps) {
    if (!agenda) return null;

    const getImageUrl = (path: string | null | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Poster';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatus = (startTime: string) => {
        return new Date(startTime) > new Date() ? { text: 'Mendatang', color: 'bg-green-500 hover:bg-green-500' } : { text: 'Selesai', color: 'bg-gray-500 hover:bg-gray-500' };
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <Badge variant="default" className={`w-fit mb-2 ${getStatus(agenda.start_time).color}`}>{getStatus(agenda.start_time).text}</Badge>
                    <DialogTitle className="text-2xl font-bold">{agenda.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="aspect-video rounded-lg overflow-hidden">
                        <ImageWithFallback src={getImageUrl(agenda.poster_image_path)} alt={agenda.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-4 text-muted-foreground">
                        <div className="flex items-start"><Calendar className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-primary" />
                            <div>
                                <p className="font-medium text-foreground">{formatDate(agenda.start_time)} - {formatDate(agenda.end_time)}</p>
                                <p className="text-sm">Waktu: {formatTime(agenda.start_time)} - {formatTime(agenda.end_time)} WIB</p>
                            </div>
                        </div>
                        <div className="flex items-start"><MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-primary" />
                            <div>
                                <p className="font-medium text-foreground">{agenda.location}</p>
                            </div>
                        </div>
                    </div>
                    <DialogDescription className="text-base text-foreground prose max-w-none">
                        {agenda.description}
                    </DialogDescription>
                </div>
            </DialogContent>
        </Dialog>
    );
}
