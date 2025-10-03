import { PhotoCard } from "./PhotoCard";

interface Photo {
  id: string;
  title: string;
  category: string;
  tags: string[];
  imageUrl: string;
  downloads: number;
  likes: number;
  views: number;
  photographer: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  loading?: boolean;
}

export function PhotoGallery({ photos, loading }: PhotoGalleryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg aspect-[4/3] mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-5 bg-muted rounded w-16" />
                <div className="h-5 bg-muted rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <span className="text-2xl">📷</span>
        </div>
        <h3 className="mb-2">Tidak ada foto ditemukan</h3>
        <p className="text-muted-foreground">
          Coba ubah kata kunci pencarian atau filter yang digunakan
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} {...photo} />
      ))}
    </div>
  );
}
