import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Search, Sparkles, Camera, Globe } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { router, usePage } from "@inertiajs/react";
import { usePhotoUploadModal } from '@/hooks/use-photo-upload-modal';

interface HeroSectionProps {
  stats: {
    totalPhotos: number;
    totalUsers: number;
  };
  photos: {
    imageUrl: string;
    title: string;
  }[];
}

export function HeroSection({ stats, photos }: HeroSectionProps) {
  const photoUploadModal = usePhotoUploadModal();
  const { auth } = usePage().props;
  const handleExploreClick = () => {
    document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Bank Foto Digital Desa Sungai Deras
            </Badge>

            <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent dark:from-white dark:via-purple-100 dark:to-blue-100">
              Koleksi Foto
              <span className="block">Kerajinan & Wisata</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Temukan ribuan foto berkualitas tinggi untuk produk kerajinan tradisional
              dan destinasi wisata Desa Sungai Deras yang menakjubkan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={handleExploreClick} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Jelajahi Koleksi
              </Button>
              <Button
                onClick={() => {
                  if (auth.user) {
                    photoUploadModal.onOpen();
                  } else {
                    router.visit(route('login'));
                  }
                }}
                variant="outline" size="lg" className="bg-white/50 backdrop-blur-sm">
                <Camera className="h-4 w-4 mr-2" />
                Upload Foto
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <span>{stats.totalPhotos.toLocaleString('id-ID')}+ Foto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span>{stats.totalUsers.toLocaleString('id-ID')} Kontributor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span>HD Quality</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative group">
                  <ImageWithFallback
                    src={photos[0]?.imageUrl || "https://placehold.co/600x400?text=Foto+1"}
                    alt={photos[0]?.title || "Kerajinan Tradisional"}
                    className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="relative group">
                  <ImageWithFallback
                    src={photos[1]?.imageUrl || "https://placehold.co/600x400?text=Foto+2"}
                    alt={photos[1]?.title || "Keramik Tradisional"}
                    className="w-full h-32 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative group">
                  <ImageWithFallback
                    src={photos[2]?.imageUrl || "https://placehold.co/600x400?text=Foto+3"}
                    alt={photos[2]?.title || "Destinasi Wisata"}
                    className="w-full h-32 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="relative group">
                  <ImageWithFallback
                    src={photos[3]?.imageUrl || "https://placehold.co/600x400?text=Foto+4"}
                    alt={photos[3]?.title || "Pantai Indonesia"}
                    className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce shadow-lg" />
            <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
