import { Agenda } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Calendar, Clock, MapPin, X, Share2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgendaDetailModalProps {
    agenda: Agenda | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AgendaDetailModal({ agenda, isOpen, onClose }: AgendaDetailModalProps) {
    if (!agenda) return null;

    const getImageUrl = (path: string | null | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/1200x800/png?text=Poster+Acara';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatus = (startTime: string) => {
        const now = new Date();
        const eventDate = new Date(startTime);
        eventDate.setHours(23, 59, 59, 999);

        return eventDate > now
            ? { text: 'Mendatang', className: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300' }
            : { text: 'Selesai', className: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-slate-700 dark:text-slate-300' };
    };

    const status = getStatus(agenda.start_time);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: agenda.title,
                text: `Jangan lewatkan acara "${agenda.title}" di Desa Sungai Deras!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert("Fitur bagikan tidak didukung di browser ini.");
        }
    };

    const handleAddToCalendar = () => {
        alert("Fitur 'Tambah ke Kalender' akan segera tersedia!");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95%] p-0 flex flex-col md:flex-row max-h-[90vh] overflow-hidden sm:max-w-2xl md:max-w-4xl xl:max-w-6xl rounded-xl">
                <div className="relative md:w-1/2 bg-slate-900 flex items-center justify-center overflow-hidden">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="absolute top-3 right-3 z-50 h-9 w-9 p-0 rounded-full bg-black/40 hover:bg-black/60 text-white hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                        <span className="sr-only">Tutup</span>
                    </Button>
                    <div className="w-full h-64 md:h-full">
                        <ImageWithFallback
                            src={getImageUrl(agenda.poster_image_path)}
                            alt={agenda.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex-shrink-0 bg-white dark:bg-slate-800 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        <DialogHeader>
                            <Badge variant="outline" className={`w-fit mb-3 ${status.className}`}>{status.text}</Badge>
                            <DialogTitle className="text-2xl md:text-3xl font-bold text-teal-900 dark:text-teal-200">
                                {agenda.title}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 text-stone-600 dark:text-stone-400 border-t border-b border-stone-200 dark:border-slate-700 py-4">
                            <div className="flex items-start"><Calendar className="w-5 h-5 mr-4 mt-1 flex-shrink-0 text-teal-700" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-slate-200">{formatDate(agenda.start_time)}</p>
                                    {agenda.end_time && formatDate(agenda.start_time) !== formatDate(agenda.end_time) && <p className="text-sm">sampai {formatDate(agenda.end_time)}</p>}
                                </div>
                            </div>
                            <div className="flex items-start"><Clock className="w-5 h-5 mr-4 mt-1 flex-shrink-0 text-teal-700" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-slate-200">{formatTime(agenda.start_time)} WIB - Selesai</p>
                                    {agenda.end_time && <p className="text-sm">Perkiraan selesai: {formatTime(agenda.end_time)} WIB</p>}
                                </div>
                            </div>
                            <div className="flex items-start"><MapPin className="w-5 h-5 mr-4 mt-1 flex-shrink-0 text-teal-700" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-slate-200">{agenda.location}</p>
                                    <p className="text-sm">Desa Sungai Deras</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-slate-200">Tentang Acara Ini</h3>
                            <DialogDescription asChild>
                                <div
                                    className="prose prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-400"
                                    dangerouslySetInnerHTML={{ __html: agenda.description }}
                                />
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="p-4 border-t border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-auto grid grid-cols-2 gap-3">
                         <Button variant="outline" className="w-full border-stone-300 dark:border-slate-600" onClick={handleShare}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Bagikan
                        </Button>
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" onClick={handleAddToCalendar}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Kalender
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
