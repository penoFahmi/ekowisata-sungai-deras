import { Agenda } from "@/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { motion } from "framer-motion";
import { route } from "ziggy-js";

interface EventsSectionProps {
    agendas: Agenda[];
    onSelectAgenda: (agenda: Agenda) => void;
}

// Konfigurasi animasi untuk container kartu (reusable)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// Konfigurasi animasi untuk setiap kartu (reusable)
const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

export function EventsSection({ agendas, onSelectAgenda }: EventsSectionProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getImageUrl = (path: string | null | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Acara';
    };

    const getStatus = (startTime: string) => {
        const now = new Date();
        const eventDate = new Date(startTime);

        eventDate.setHours(23, 59, 59, 999);

        return eventDate > now
            ? { text: 'Mendatang', className: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300' }
            : { text: 'Selesai', className: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-slate-700 dark:text-slate-300' };
    };

    return (
        <section id="events" className="py-24 bg-white dark:bg-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-teal-900 dark:text-teal-200 mb-4">
                        Agenda & Acara Mendatang
                    </h2>
                    <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                        Jangan lewatkan berbagai acara menarik di Desa Sungai Deras.
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    {agendas.map((agenda) => {
                        const status = getStatus(agenda.start_time);
                        return (
                            <motion.div variants={cardVariants} key={agenda.id}>
                                <Card className="group bg-white dark:bg-slate-800 hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-stone-200 dark:border-slate-700 hover:border-amber-500/40">
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold line-clamp-2 text-gray-800 dark:text-slate-200 pr-2">{agenda.title}</h3>
                                            <Badge variant="outline" className={`flex-shrink-0 ${status.className}`}>{status.text}</Badge>
                                        </div>

                                        <div className="space-y-3 mb-6 text-sm text-stone-500 dark:text-stone-400 flex-grow">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-3 flex-shrink-0 text-teal-700" />
                                                <span>{formatDate(agenda.start_time)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-3 flex-shrink-0 text-teal-700" />
                                                <span>{formatTime(agenda.start_time)} - {agenda.end_time ? formatTime(agenda.end_time) : 'Selesai'}</span>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPin className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-teal-700" />
                                                <span>{agenda.location}</span>
                                            </div>
                                        </div>
                                        <div className="mt-auto">
                                            <Button type="button" onClick={() => onSelectAgenda(agenda)} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                                                    Lihat Detail Acara
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>

                <div className="text-center mt-12">
                    <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-base rounded-full px-8 py-6">
                        <Link href={route('agenda-list.index')}>
                            Lihat Semua Agenda <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
