import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Search,
  Star,
  MapPin,
  ArrowRight,
  Filter
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const umkmCategories = [
  "Semua",
  "Kerajinan",
  "Makanan & Minuman",
  "Tekstil",
  "Pertanian",
  "Jasa"
];

const umkmData = [
  {
    id: 1,
    name: "Kerajinan Bambu Pak Joko",
    category: "Kerajinan",
    description: "Aneka kerajinan bambu berkualitas tinggi: keranjang, tempat tisu, hiasan dinding",
    image: "https://images.unsplash.com/photo-1575839127397-c12e55f70a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTgzODYzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    location: "Jl. Kerajinan No. 15",
    price: "Rp 25.000 - Rp 150.000"
  },
  {
    id: 2,
    name: "Batik Sari Indah",
    category: "Tekstil",
    description: "Batik tulis dan cap dengan motif khas Sungai Deras, tersedia baju dan kain",
    image: "https://images.unsplash.com/photo-1672716912467-fd99b71cf780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRpayUyMHRleHRpbGUlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    location: "Kampung Tenun",
    price: "Rp 75.000 - Rp 300.000"
  },
  {
    id: 3,
    name: "Keripik Singkong Mak Tini",
    category: "Makanan & Minuman",
    description: "Keripik singkong renyah dengan berbagai varian rasa: original, balado, keju",
    image: "https://images.unsplash.com/photo-1622572771591-6ca7813cc39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXQlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    location: "Jl. Raya Desa No. 28",
    price: "Rp 15.000 - Rp 25.000"
  },
  {
    id: 4,
    name: "Tani Organik Segar",
    category: "Pertanian",
    description: "Sayuran organik segar: kangkung, bayam, tomat, cabai langsung dari kebun",
    image: "https://images.unsplash.com/photo-1667885098658-f34fed001418?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMG1hcmtldHxlbnwxfHx8fDE3NTgyODU1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    location: "Area Persawahan",
    price: "Rp 5.000 - Rp 20.000"
  },
  {
    id: 5,
    name: "Furniture Kayu Pak Budi",
    category: "Kerajinan",
    description: "Mebel kayu jati berkualitas: meja, kursi, lemari dengan desain modern dan klasik",
    image: "https://images.unsplash.com/photo-1738679616159-59dd8542a5ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjcmFmdHMlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2NDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    location: "Jl. Industri No. 7",
    price: "Rp 500.000 - Rp 5.000.000"
  },
  {
    id: 6,
    name: "Gudeg Bu Minah",
    category: "Makanan & Minuman",
    description: "Gudeg jogja autentik dengan bumbu rahasia turun temurun, tersedia paket lengkap",
    image: "https://images.unsplash.com/photo-1622572771591-6ca7813cc39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXQlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    location: "Pusat Kuliner",
    price: "Rp 18.000 - Rp 35.000"
  }
];

export function UMKMSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredUMKM = umkmData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDirectory = () => {
    const element = document.querySelector('#umkm');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="umkm" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Direktori UMKM Desa Sungai Deras
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dukung ekonomi lokal dengan membeli produk berkualitas dari UMKM desa
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Cari UMKM atau produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {umkmCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* UMKM Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredUMKM.map((umkm) => (
            <Card key={umkm.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={umkm.image}
                  alt={umkm.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{umkm.category}</Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm">{umkm.rating}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{umkm.name}</h3>
                <p className="text-muted-foreground mb-3 line-clamp-2">
                  {umkm.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {umkm.location}
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {umkm.price}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Lihat Detail
                  </Button>
                  <Button size="sm" className="flex-1">
                    Hubungi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center">
          <Button size="lg" onClick={handleViewDirectory}>
            Lihat Semua UMKM
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {filteredUMKM.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Tidak ada UMKM yang sesuai dengan pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
