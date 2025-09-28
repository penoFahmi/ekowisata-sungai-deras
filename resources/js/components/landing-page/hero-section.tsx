import { Button } from "../ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function HeroSection() {
  const handleExploreMap = () => {
    const element = document.querySelector('#map');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1667809938371-a29e3caac747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMHZpbGxhZ2UlMjBzY2VuaWMlMjBsYW5kc2NhcGUlMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzU4Mzg2MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Pemandangan Desa Sungai Deras"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Temukan Surga Tersembunyi di
            <span className="block text-accent">Desa Sungai Deras</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Jelajahi keindahan alam, budaya lokal, dan produk UMKM terbaik
            di destinasi wisata yang menawan ini
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white"
              onClick={handleExploreMap}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Jelajahi Peta Wisata
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Lihat UMKM Lokal
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
