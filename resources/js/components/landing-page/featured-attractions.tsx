import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const attractions = [
  {
    id: 1,
    name: "Air Terjun Sungai Deras",
    description: "Air terjun spektakuler dengan ketinggian 50 meter yang menjadi ikon desa wisata",
    image: "https://images.unsplash.com/photo-1604371114661-7b3637c73da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBuYXR1cmUlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    location: "Kampung Indah",
    category: "Wisata Alam"
  },
  {
    id: 2,
    name: "Sentra Kerajinan Bambu",
    description: "Pusat kerajinan bambu tradisional dengan berbagai produk unik dan berkualitas",
    image: "https://images.unsplash.com/photo-1575839127397-c12e55f70a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTgzODYzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    location: "Jl. Kerajinan No. 15",
    category: "UMKM"
  },
  {
    id: 3,
    name: "Pasar Kuliner Tradisional",
    description: "Cicipi berbagai makanan khas desa dengan cita rasa autentik yang menggugah selera",
    image: "https://images.unsplash.com/photo-1622572771591-6ca7813cc39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXQlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    location: "Pusat Desa",
    category: "Kuliner"
  }
];

export function FeaturedAttractions() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Atraksi Wisata Unggulan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan pengalaman tak terlupakan di destinasi wisata terbaik Desa Sungai Deras
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.map((attraction) => (
            <Card key={attraction.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {attraction.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm">{attraction.rating}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {attraction.description}
                </p>

                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {attraction.location}
                </div>

                <Button variant="outline" className="w-full group">
                  Lihat Detail
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Lihat Semua Atraksi
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
