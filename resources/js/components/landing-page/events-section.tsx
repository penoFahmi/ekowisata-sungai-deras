import { Agenda } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventsSectionProps {
  agendas: Agenda[];
}

export function EventsSection({ agendas }: EventsSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <section id="events" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Agenda & Acara Mendatang
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jangan lewatkan berbagai acara menarik di Desa Sungai Deras
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agendas.map((agenda) => (
            <Card key={agenda.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">Acara</Badge>
                  <Badge
                    variant='default'
                    className='bg-green-500'
                  >
                    Mendatang
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold mb-3">{agenda.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {agenda.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(agenda.start_time)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(agenda.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - Selesai
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {agenda.location}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Detail Acara
                  </Button>
                  <Button size="sm" className="flex-1">
                    Daftar Sekarang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Lihat Semua Agenda
          </Button>
        </div>
      </div>
    </section>
  );
}
