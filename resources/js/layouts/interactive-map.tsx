import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Icon } from "../components/ui/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import {
  MapPin,
  Mountain,
  UtensilsCrossed,
  Home,
  Store,
  Filter,
  Star,
  Navigation
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const categories = [
  { id: "all", name: "Semua", icon: MapPin, color: "bg-gray-500" },
  { id: "nature", name: "Wisata Alam", icon: Mountain, color: "bg-green-500" },
  { id: "culinary", name: "Kuliner", icon: UtensilsCrossed, color: "bg-orange-500" },
  { id: "accommodation", name: "Penginapan", icon: Home, color: "bg-blue-500" },
  { id: "umkm", name: "UMKM", icon: Store, color: "bg-purple-500" },
];

const pointsOfInterest = [
  {
    id: 1,
    name: "Air Terjun Sungai Deras",
    category: "nature",
    position: { x: 45, y: 30 },
    description: "Air terjun spektakuler dengan ketinggian 50 meter",
    image: "https://images.unsplash.com/photo-1604371114661-7b3637c73da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBuYXR1cmUlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    location: "Kampung Indah"
  },
  {
    id: 2,
    name: "Warung Mak Inah",
    category: "culinary",
    position: { x: 60, y: 50 },
    description: "Warung legendaris dengan nasi gudeg terenak se-desa",
    image: "https://images.unsplash.com/photo-1622572771591-6ca7813cc39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXQlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    location: "Jl. Raya Desa No. 12"
  },
  {
    id: 3,
    name: "Homestay Sari Asih",
    category: "accommodation",
    position: { x: 35, y: 65 },
    description: "Penginapan nyaman dengan pemandangan sungai",
    image: "https://images.unsplash.com/photo-1667809938371-a29e3caac747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMHZpbGxhZ2UlMjBzY2VuaWMlMjBsYW5kc2NhcGUlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    location: "Kampung Hijau"
  },
  {
    id: 4,
    name: "Toko Kerajinan Bambu Pak Joko",
    category: "umkm",
    position: { x: 70, y: 35 },
    description: "Aneka kerajinan bambu berkualitas tinggi",
    image: "https://images.unsplash.com/photo-1575839127397-c12e55f70a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTgzODYzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    location: "Jl. Kerajinan No. 15"
  },
  {
    id: 5,
    name: "Bukit Sunrise",
    category: "nature",
    position: { x: 25, y: 20 },
    description: "Spot terbaik untuk menikmati matahari terbit",
    image: "https://images.unsplash.com/photo-1604371114661-7b3637c73da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBuYXR1cmUlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    location: "Puncak Desa"
  },
  {
    id: 6,
    name: "Kedai Kopi Sawah",
    category: "culinary",
    position: { x: 50, y: 70 },
    description: "Kopi robusta asli dengan view persawahan",
    image: "https://images.unsplash.com/photo-1622572771591-6ca7813cc39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXQlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    location: "Area Persawahan"
  }
];

export function InteractiveMap() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPOI, setSelectedPOI] = useState<typeof pointsOfInterest[0] | null>(null);

  const filteredPOIs = selectedCategory === "all"
    ? pointsOfInterest
    : pointsOfInterest.filter(poi => poi.category === selectedCategory);

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || "bg-gray-500";
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || MapPin;
  };

  return (
    <section id="map" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Peta Wisata Interaktif
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jelajahi semua destinasi menarik di Desa Sungai Deras dengan peta interaktif
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter Kategori
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        selectedCategory === category.id ? "bg-primary" : ""
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-br from-green-100 to-blue-100 h-[600px]">
                {/* Background Map Illustration */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 800 600">
                    {/* River */}
                    <path
                      d="M100 300 Q200 250 300 280 T500 250 T700 280"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      fill="none"
                      className="opacity-60"
                    />
                    {/* Mountains */}
                    <polygon
                      points="50,200 150,100 250,200"
                      fill="#10B981"
                      className="opacity-40"
                    />
                    <polygon
                      points="600,180 700,80 800,180"
                      fill="#10B981"
                      className="opacity-40"
                    />
                    {/* Forest areas */}
                    <circle cx="200" cy="400" r="60" fill="#22C55E" className="opacity-30" />
                    <circle cx="600" cy="450" r="80" fill="#22C55E" className="opacity-30" />
                  </svg>
                </div>

                {/* POI Markers */}
                {filteredPOIs.map((poi) => {
                  const Icon = getCategoryIcon(poi.category);
                  return (
                    <Button
                      key={poi.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${getCategoryColor(poi.category)} rounded-full p-3 text-white shadow-lg hover:shadow-xl`}
                      style={{
                        left: `${poi.position.x}%`,
                        top: `${poi.position.y}%`,
                      }}
                      onClick={() => setSelectedPOI(poi)}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  );
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm">Legenda</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(1).map((category) => {
                      const Icon = category.icon;
                      return (
                        <div key={category.id} className="flex items-center space-x-2 text-xs">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span>{category.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compass */}
                <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* POI Detail Modal */}
        <Dialog open={!!selectedPOI} onOpenChange={() => setSelectedPOI(null)}>
          <DialogContent className="max-w-md">
            {selectedPOI && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedPOI.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <ImageWithFallback
                    src={selectedPOI.image}
                    alt={selectedPOI.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(selectedPOI.category)}>
                        {categories.find(cat => cat.id === selectedPOI.category)?.name}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{selectedPOI.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{selectedPOI.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedPOI.location}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1">Lihat Detail</Button>
                    <Button variant="outline" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigasi
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
