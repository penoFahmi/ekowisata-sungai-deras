import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Festival Kerajinan Bambu 2025",
    date: "15-17 Maret 2025",
    time: "09:00 - 17:00 WIB",
    location: "Sentra Kerajinan Bambu",
    description: "Festival tahunan menampilkan berbagai kerajinan bambu dan workshop untuk umum",
    category: "Festival",
    participants: "500+ peserta",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Lomba Foto Alam Sungai Deras",
    date: "22 Maret 2025",
    time: "06:00 - 18:00 WIB",
    location: "Seluruh Area Desa",
    description: "Kompetisi fotografi dengan tema keindahan alam Desa Sungai Deras",
    category: "Kompetisi",
    participants: "150+ peserta",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Pelatihan UMKM Digital Marketing",
    date: "5 April 2025",
    time: "13:00 - 16:00 WIB",
    location: "Balai Desa",
    description: "Workshop gratis untuk pelaku UMKM tentang pemasaran digital dan media sosial",
    category: "Workshop",
    participants: "50+ peserta",
    status: "upcoming"
  }
];

export function EventsSection() {
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
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">{event.category}</Badge>
                  <Badge
                    variant={event.status === 'upcoming' ? 'default' : 'outline'}
                    className={event.status === 'upcoming' ? 'bg-green-500' : ''}
                  >
                    {event.status === 'upcoming' ? 'Mendatang' : 'Berlangsung'}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {event.participants}
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
