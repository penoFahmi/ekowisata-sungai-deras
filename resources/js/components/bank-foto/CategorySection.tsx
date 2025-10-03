import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface CategorySectionProps {
  onCategoryChange: (category: string) => void;
  countKerajinan: number;
  countWisata: number;
}

export function CategorySection({ onCategoryChange, countKerajinan, countWisata }: CategorySectionProps) {
  const categoriesData = [
    {
      id: "kerajinan",
      title: "Kerajinan Tradisional",
      description: "Temukan keindahan seni tradisional Indonesia",
      image: "https://images.unsplash.com/photo-1751906491847-6f6712b145af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNyYWZ0JTIwaGFuZG1hZGV8ZW58MXx8fHwxNzU5MTYzNjU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: "🏺",
      count: countKerajinan.toLocaleString('id-ID') + "+ Foto",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50"
    },
    {
      id: "wisata",
      title: "Destinasi Wisata",
      description: "Jelajahi keindahan nusantara Indonesia",
      image: "https://images.unsplash.com/photo-1546661869-cf589fac7085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3VyaXNtJTIwZGVzdGluYXRpb24lMjB0cmF2ZWx8ZW58MXx8fHwxNzU5MTYzNjU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: "🏖️",
      count: countWisata.toLocaleString('id-ID') + "+ Foto",
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50"
    }
  ];

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
            Kategori Unggulan
          </Badge>
        </div>
        <h2 className="text-3xl mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Eksplorasi Berdasarkan Kategori
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pilih kategori yang sesuai dengan kebutuhan proyek Anda dan temukan ribuan foto berkualitas tinggi
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {categoriesData.map((category) => (
          <Card
            key={category.id}
            className={`overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${category.bgGradient} border-0 cursor-pointer hover:scale-[1.02]`}
            onClick={() => onCategoryChange(category.id)}
          >
            <div className="relative h-64 overflow-hidden">
              <ImageWithFallback
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Category Icon */}
              <div className="absolute top-4 left-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
              </div>

              {/* Photo Count */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-gray-700 backdrop-blur-sm">
                  {category.count}
                </Badge>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl mb-2">{category.title}</h3>
                <p className="text-white/80 mb-4">{category.description}</p>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20 text-white group-hover:translate-x-1 transition-transform"
                >
                  Jelajahi Sekarang
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
