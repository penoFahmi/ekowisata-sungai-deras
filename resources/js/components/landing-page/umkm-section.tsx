import { useState } from "react";
import { Umkm } from "@/types";
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
import { Link } from "@inertiajs/react";

interface UMKMSectionProps {
  umkms: Umkm[];
}

export function UMKMSection({ umkms }: UMKMSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Membuat daftar kategori dinamis dari data yang ada
  const umkmCategories = ["Semua", ...Array.from(new Set(umkms.map(item => item.category.name)))];

  const filteredUMKM = umkms.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDirectory = () => {
    const element = document.querySelector('#umkm');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const getImageUrl = (path: string) => {
    return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=UMKM';
  };

  return (
    <section id="umkm" className="py-20 bg-stone-50 dark:bg-gray-900">
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
                  src={getImageUrl(umkm.galleries[0]?.path)}
                  alt={umkm.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{umkm.category.name}</Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm">4.5</span> {/* Rating statis untuk sementara */}
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
                    {umkm.address}
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {umkm.owner_name}
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
          <Button asChild size="lg">
            <Link href={route('umkm-list.index')}>
            Lihat Semua UMKM
            <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
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
