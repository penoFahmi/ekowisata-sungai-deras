import { useState, useMemo, useEffect } from "react";
import { TourismSpot, Umkm } from "@/types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  MapPin,
  Mountain,
  UtensilsCrossed,
  Home,
  Store,
  Filter,
} from "lucide-react";

// Import komponen dari react-leaflet
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix untuk ikon default Leaflet yang rusak di React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
});

L.Marker.prototype.options.icon = DefaultIcon;

const categories = [
  { id: "all", name: "Semua", icon: MapPin, color: "bg-gray-500" },
  { id: "wisata", name: "Wisata", icon: Mountain, color: "bg-green-500" },
  { id: "umkm", name: "UMKM", icon: Store, color: "bg-purple-500" },
];

// --- START: Penambahan Ikon Kustom ---
const wisataIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const umkmIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
// --- END: Penambahan Ikon Kustom ---

interface InteractiveMapProps {
  tourismSpots: TourismSpot[];
  umkms: Umkm[];
}

export function InteractiveMap({ tourismSpots, umkms }: InteractiveMapProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dusunBoundary, setDusunBoundary] = useState(null);

  // Style untuk layer batas desa dan dusun
  const desaStyle = { color: "#e67e22", weight: 3, opacity: 0.8, fillOpacity: 0.1 };
  const dusunStyle = { color: "#e67e22", weight: 1.5, opacity: 0.7, dashArray: '5, 5' };

  useEffect(() => {
    // Ambil data GeoJSON dari folder public
    fetch('/maps/peta.geojson')
        .then(res => res.json())
        .then(data => setDusunBoundary(data))
        .catch(err => console.error("Gagal memuat batas dusun:", err));
  }, []);

  // --- START: Fungsi untuk Popup Nama Dusun ---
  const onEachDusun = (feature, layer) => {
    if (feature.properties && feature.properties.Keterangan) {
      layer.bindPopup(feature.properties.Keterangan);
      layer.on('mouseover', function (e) {
        this.openPopup();
      });
    }
  };
  // --- END: Fungsi untuk Popup Nama Dusun ---

  // Gabungkan data wisata dan umkm menjadi satu array untuk ditampilkan di peta
  const pointsOfInterest = useMemo(() => {
    const spots = tourismSpots.map(spot => ({
      ...spot,
      type: 'wisata' as const,
    }));
    const umkmItems = umkms.map(umkm => ({
      ...umkm,
      type: 'umkm' as const,
    }));
    return [...spots, ...umkmItems];
  }, [tourismSpots, umkms]);

  const filteredPOIs = useMemo(() => {
    if (selectedCategory === "all") return pointsOfInterest;
    return pointsOfInterest.filter(poi => poi.type === selectedCategory);
  }, [selectedCategory, pointsOfInterest]);

  const getImageUrl = (path: string) => {
    return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=Image';
  };

  // Tentukan titik tengah peta, bisa dari data pertama atau lokasi desa
  const mapCenter: [number, number] = pointsOfInterest.length > 0
    ? [parseFloat(pointsOfInterest[0].latitude), parseFloat(pointsOfInterest[0].longitude)]
    : [-0.26, 109.24]; // Default jika tidak ada data

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
                      className={`w-full justify-start ${selectedCategory === category.id ? "bg-primary" : ""}`}
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
            <Card className="overflow-hidden h-[600px] w-full">
              <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Tampilkan layer GeoJSON jika data sudah dimuat */}
                {dusunBoundary && <GeoJSON data={dusunBoundary} style={dusunStyle} onEachFeature={onEachDusun} />}


                {filteredPOIs.map((poi) => {
                  if (!poi.latitude || !poi.longitude) return null;
                  // Pilih ikon berdasarkan tipe
                  const markerIcon = poi.type === 'wisata' ? wisataIcon : umkmIcon;
                  return (
                    <Marker key={`${poi.type}-${poi.id}`} position={[parseFloat(poi.latitude), parseFloat(poi.longitude)]} icon={markerIcon}>
                      <Popup>
                        <div className="w-48">
                          <img src={getImageUrl(poi.galleries[0]?.path)} alt={poi.name} className="w-full h-24 object-cover rounded-md mb-2" />
                          <h4 className="font-bold text-md">{poi.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{poi.description}</p>
                          <Badge variant="outline" className="mt-2">{poi.category.name}</Badge>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
