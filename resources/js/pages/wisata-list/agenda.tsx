import { Link, Head, usePage, router } from '@inertiajs/react';
import { Navigation } from '@/components/landing-page/navigation';
import { Footer } from '@/components/landing-page/footer';
import { PageProps, PaginatedResponse, Agenda } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, MapPin, Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { route } from 'ziggy-js';
import { HeroSectionSecond } from '@/components/landing-page/hero-section-second';
import { AgendaDetailModal } from '@/components/agenda/AgendaDetailModal';

interface AgendaIndexProps extends PageProps {
    agendas: PaginatedResponse<Agenda>;
    filters: {
        search?: string;
    }
}

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
        return new Date(startTime) > new Date() ? { text: 'Mendatang', color: 'bg-green-500' } : { text: 'Selesai', color: 'bg-gray-500' };
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        router.get(route('agenda-list.index'), { search: debouncedSearchTerm }, { preserveState: true, replace: true, preserveScroll: true });
    }, [debouncedSearchTerm]);

    return (
        <div className="bg-background text-foreground">
            <Head title="Semua Agenda" />
            <Navigation />
            <HeroSectionSecond
                title="Agenda & Acara"
                description="Ikuti terus berbagai acara dan kegiatan menarik yang diselenggarakan di Desa Sungai Deras."
            />
            <main>
                <section className="py-20 md:py-28">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8 max-w-lg mx-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input type="search" placeholder="Cari nama acara..." className="pl-10 h-12 text-base" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>

                            {agendas.data.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <h3 className="text-xl font-semibold mb-2">Agenda Tidak Ditemukan</h3>
                                    <p className="text-muted-foreground">Saat ini tidak ada agenda yang sesuai dengan pencarian Anda.</p>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {agendas.data.map((agenda) => (
                                    <Card key={agenda.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                                        <div className="relative overflow-hidden aspect-video">
                                            <ImageWithFallback src={getImageUrl(agenda.poster_image_path)} alt={agenda.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <Badge variant="default" className={`absolute top-3 right-3 ${getStatus(agenda.start_time).color}`}>{getStatus(agenda.start_time).text}</Badge>
                                        </div>
                                        <CardContent className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-semibold mb-2 line-clamp-2">{agenda.title}</h3>
                                            <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-grow">
                                                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /><span>{formatDate(agenda.start_time)}</span></div>
                                                <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /><span>Mulai Pukul {formatTime(agenda.start_time)} WIB</span></div>
                                                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /><span>{agenda.location}</span></div>
                                            </div>
                                                <Button className="w-full" onClick={() => setSelectedAgenda(agenda)}>
                                                    Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {agendas.data.length > 0 && (
                                <Pagination>
                                    <PaginationContent>
                                        {agendas.links.map((link, index) => (
                                            <PaginationItem key={index} className={!link.url ? 'opacity-50 pointer-events-none' : ''}>
                                                <PaginationLink asChild isActive={link.active}>
                                                    <Link href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} preserveState preserveScroll />
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                    </PaginationContent>
                                </Pagination>
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
