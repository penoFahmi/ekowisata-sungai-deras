import { Agenda } from "@/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface EventsSectionProps {
  agendas: Agenda[];
}

export function EventsSection({ agendas }: EventsSectionProps) {
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
    return eventDate > now
      ? { text: 'Mendatang', className: 'bg-green-100 text-green-800 border-green-200' }
      : { text: 'Selesai', className: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  return (
    <section id="events" className="py-20 bg-teal-50 dark:bg-gray-800">
      <div className="min-h-screen bg-gradient-to-b">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Agenda & Acara Mendatang
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jangan lewatkan berbagai acara menarik di Desa Sungai Deras
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {agendas.map((agenda) => {
            const status = getStatus(agenda.start_time);
            return (
            <Card key={agenda.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden aspect-video">
                  <ImageWithFallback src={getImageUrl(agenda.poster_image_path)} alt={agenda.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <Badge variant="outline" className={`absolute top-3 right-3 backdrop-blur-sm ${status.className}`}>{status.text}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">{agenda.title}</h3>

                <div className="space-y-2 mb-6 text-sm text-muted-foreground flex-grow">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(agenda.start_time)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(agenda.start_time)} - {agenda.end_time ? formatTime(agenda.end_time) : 'Selesai'}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {agenda.location}
                  </div>
                </div>
                <div className="mt-auto">
                  <Link href={route('agenda-list.index')}>
                    <Button className="w-full">
                      Lihat Detail Acara
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href={route('agenda-list.index')}>
              Lihat Semua Agenda <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
