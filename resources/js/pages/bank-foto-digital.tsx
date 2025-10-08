import { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { usePage, router, Link } from "@inertiajs/react";
import { useDebounce } from "use-debounce";
import { Header } from "@/components/bank-foto/Header";
import { Footer} from "@/components/landing-page/footer";
import { HeroSection } from "../components/bank-foto/HeroSection";
import { SearchFilters } from "../components/bank-foto/SearchFilters";
import { PhotoGallery } from "../components/bank-foto/PhotoGallery";
import { StatsBar } from "../components/bank-foto/StatsBar";
import { CategorySection } from "../components/bank-foto/CategorySection";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import ModalFormPhoto from '@/components/bank-foto/ModalFormPhoto';
import { usePhotoUploadModal } from '@/hooks/use-photo-upload-modal';
import ModalPhotoDetail from '@/components/bank-foto/ModalPhotoDetail';
import { PageProps, PaginatedResponse } from "@/types";
import { route } from "ziggy-js"
import { toast } from 'sonner';

interface Photo {
  id: number;
  title: string;
  category: 'kerajinan' | 'wisata';
  tags: { name: string, slug: string }[];
  image_path: string;
  downloads: number;
  likes: number;
  views: number;
  user: { name: string };
  is_liked: boolean;
}

interface BankFotoPageProps extends PageProps {
  photos: PaginatedResponse<Photo>;
  stats: {
    totalPhotos: number;
    totalUsers: number;
    totalDownloads: number;
    totalLikes: number;
    countKerajinan: number;
    countWisata: number;
  };
  availableTags: { name: string, slug: string }[];
  filters: {
    search?: string;
    category?: string;
    tags?: string[];
    sort?: string;
  };
}

export default function App() {
  const { photos, stats, availableTags = [], filters: initialFilters, flash } = usePage<BankFotoPageProps>().props;
  const photoUploadModal = usePhotoUploadModal();
  const filters = initialFilters && !Array.isArray(initialFilters) ? initialFilters : {};

  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "all");
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = filters.tags || [];
    // Ensure tags is always an array, not an object from the query string
    return Array.isArray(tags) ? tags : Object.values(tags);
  });
  const [sortBy, setSortBy] = useState(filters.sort || "newest");

  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (flash?.success) {
        toast.success(flash.success);
    }
  }, [flash]);

  useEffect(() => {
    const queryParams: any = {};

    if (debouncedSearch) queryParams.search = debouncedSearch;
    if (selectedCategory !== "all") queryParams.category = selectedCategory;
    if (selectedTags.length > 0) queryParams.tags = selectedTags;
    if (sortBy !== "newest") queryParams.sort = sortBy;
    // FIX: Use the correct route name 'bank-foto.index'
    router.get(route('bank-foto.index'), queryParams, {
      preserveState: true,
      replace: true,
    });
  }, [debouncedSearch, selectedCategory, selectedTags, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLike = (photoId: string) => {
    router.post(route('bank-foto.like', photoId), {}, {
      preserveScroll: true,
    });
  };

  const handleDownload = (photoId: string) => {
    window.open(route('bank-foto.download', photoId), '_blank');
  };

  const handlePhotoClick = async (photoId: string) => {
    setDetailModalOpen(true);
    try {
      const response = await axios.get(route('bank-foto.show', photoId));
      setSelectedPhoto(response.data);
      // Optimistically update the view count on the gallery
      router.reload({ only: ['photos'], preserveState: true, preserveScroll: true });
    } catch (error) {
      console.error("Failed to fetch photo details:", error);
      toast.error("Gagal memuat detail foto.");
      setDetailModalOpen(false);
    }
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedPhoto(null);
  };
  // Format photo data from the backend to match what the PhotoCard component expects
  const formattedPhotos = useMemo(() => {
    // FIX: Use optional chaining and a nullish coalescing operator to prevent crashes if photos.data is not present.
    return (photos.data || []).map(photo => ({
      id: photo.id.toString(),
      title: photo.title,
      category: photo.category,
      tags: photo.tags.map(t => t.name),
      imageUrl: `/storage/${photo.image_path}`,
      downloads: photo.downloads,
      likes: photo.likes,
      views: photo.views,
      photographer: photo.user.name,
      is_liked: photo.is_liked,
    }));
  }, [photos.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* <Navigation /> */}
      <Header />
      <ModalFormPhoto
          isOpen={photoUploadModal.isOpen}
          onClose={photoUploadModal.onClose}
          onSuccess={() => router.reload({ only: ['photos', 'stats'], onSuccess: () => toast.success('Foto berhasil diunggah!') })}
      />
      <ModalPhotoDetail
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          photo={selectedPhoto}
          onLike={(id) => handleLike(id.toString())}
          onDownload={(id) => handleDownload(id.toString())}
      />
      <HeroSection stats={stats} photos={formattedPhotos} />

      <main id="gallery-section" className="container mx-auto px-4 py-12">
        <StatsBar {...stats} />

        <CategorySection
          onCategoryChange={setSelectedCategory}
          countKerajinan={stats.countKerajinan}
          countWisata={stats.countWisata}
        />

        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Temukan Foto Impian Anda
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Gunakan filter pencarian untuk menemukan foto yang sesuai dengan kebutuhan proyek Anda
            </p>
          </div>

          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            sortBy={sortBy}
            onSortChange={setSortBy}
            availableTags={availableTags.map(t => t.slug)}
          />

          <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <p className="text-gray-600">
              {/* FIX: Safely access nested properties with optional chaining and provide a fallback value. */}
              Menampilkan <span className="font-semibold text-purple-600">{photos.data?.length || 0}</span> dari <span className="font-semibold">{photos.meta?.total || 0}</span> foto
            </p>
            {(photos.data?.length || 0) > 0 && (
              <div className="text-sm text-gray-500">
                📸 Foto berkualitas HD tersedia
              </div>
            )}
          </div>

          <PhotoGallery
            photos={formattedPhotos}
            onPhotoClick={handlePhotoClick}
            onLike={handleLike}
            onDownload={handleDownload}
          />

          {/* Pagination */}
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                {/* FIX: Safely map over links, providing an empty array as a fallback. */}
                {(photos.meta?.links || []).map((link, index) => (
                  <PaginationItem key={index} className={!link.url ? 'opacity-50 pointer-events-none' : ''}>
                    <Link href={link.url || '#'} className={`px-4 py-2 border rounded-md ${link.active ? 'bg-purple-600 text-white border-purple-600' : 'bg-white'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          </div>

        </div>
      </main>
      <Footer/>
    </div>
  );
}
