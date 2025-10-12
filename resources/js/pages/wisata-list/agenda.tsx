import { Link, Head, usePage, router } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, Agenda } from '@/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { route } from 'ziggy-js';
import { HeroSectionSecond } from '@/components/landing-page/hero-section-second';
import { AgendaDetailModal } from '@/components/agenda/AgendaDetailModal';
import { motion } from 'framer-motion';

interface AgendaIndexProps extends PageProps {
    agendas: PaginatedResponse<Agenda>;
    filters: {
        search?: string;
    }
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

export default function AgendaIndex() {
    const { agendas, filters } = usePage<AgendaIndexProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);
    const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);

    const getImageUrl = (path: string | null | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Acara';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
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

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        router.get(route('agenda-list.index'), { search: debouncedSearchTerm }, { preserveState: true, replace: true, preserveScroll: true });
    }, [debouncedSearchTerm]);

    const { links } = agendas;
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        <div className="min-h-screen bg-stone-100 dark:bg-slate-900">
            <Head title="Semua Agenda" />
            <Navigation />
            <HeroSectionSecond
                title="Agenda & Acara"
                description="Ikuti terus berbagai acara dan kegiatan menarik yang diselenggarakan di Desa Sungai Deras."
            />
            <main>
                <section className="py-20 md:py-28 bg-white dark:bg-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-16 max-w-lg mx-auto">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                    <Input type="search" placeholder="Cari nama acara..." className="pl-12 h-14 text-base bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700 focus-visible:ring-amber-500 rounded-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>

                            {agendas.data.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-stone-300 dark:border-slate-700 rounded-lg">
                                    <Search className="mx-auto h-12 w-12 text-stone-400 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-slate-200">Agenda Tidak Ditemukan</h3>
                                    <p className="text-stone-500 dark:text-stone-400">Saat ini tidak ada agenda yang sesuai dengan pencarian Anda.</p>
                                </div>
                            ) : (
                                <>
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                                    >
                                        {agendas.data.map((agenda) => {
                                            const status = getStatus(agenda.start_time);
                                            return (
                                                <motion.div variants={cardVariants} key={agenda.id}>
                                                    <Card className="group bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-amber-500/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 h-full">
                                                        <CardHeader className="p-0">
                                                            <div className="relative overflow-hidden aspect-video">
                                                                <ImageWithFallback src={getImageUrl(agenda.poster_image_path)} alt={agenda.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                                <Badge variant="outline" className={`absolute top-3 right-3 backdrop-blur-sm ${status.className}`}>{status.text}</Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-6 flex flex-col flex-grow">
                                                            <h3 className="text-xl font-semibold mb-4 line-clamp-2 text-gray-800 dark:text-slate-200">{agenda.title}</h3>
                                                            <div className="space-y-3 text-sm text-stone-500 dark:text-stone-400 mb-6 flex-grow">
                                                                <div className="flex items-center"><Calendar className="w-4 h-4 mr-3 flex-shrink-0 text-teal-700" /><span>{formatDate(agenda.start_time)}</span></div>
                                                                <div className="flex items-center"><Clock className="w-4 h-4 mr-3 flex-shrink-0 text-teal-700" /><span>Mulai Pukul {formatTime(agenda.start_time)} WIB</span></div>
                                                                <div className="flex items-start"><MapPin className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-teal-700" /><span>{agenda.location}</span></div>
                                                            </div>
                                                            <Button className="w-full mt-auto bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setSelectedAgenda(agenda)}>
                                                                Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            )
                                        })}
                                    </motion.div>

                                    {links.length > 3 && (
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <Link href={prevLink.url || '#'} preserveState preserveScroll className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-amber-100/50 dark:hover:bg-slate-700 ${!prevLink.url ? 'opacity-50 pointer-events-none' : ''}`}>
                                                        <ChevronLeft className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Sebelumnya</span>
                                                    </Link>
                                                </PaginationItem>
                                                {pageLinks.map((link, index) => (
                                                    link.label.includes('...')
                                                    ? <PaginationItem key={index}><span className="px-4 py-2">...</span></PaginationItem>
                                                    : (
                                                        <PaginationItem key={index}>
                                                            <Link href={link.url || '#'} preserveState preserveScroll className={`px-4 py-2 rounded-md ${link.active ? 'bg-amber-600 text-white hover:bg-amber-700' : 'hover:bg-amber-100/50 dark:hover:bg-slate-700'}`}>{link.label}</Link>
                                                        </PaginationItem>
                                                    )
                                                ))}
                                                <PaginationItem>
                                                    <Link href={nextLink.url || '#'} preserveState preserveScroll className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-amber-100/50 dark:hover:bg-slate-700 ${!nextLink.url ? 'opacity-50 pointer-events-none' : ''}`}>
                                                        <span className="hidden sm:inline">Berikutnya</span>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <AgendaDetailModal agenda={selectedAgenda} isOpen={!!selectedAgenda} onClose={() => setSelectedAgenda(null)} />
            <Footer />
        </div>
    );
}
