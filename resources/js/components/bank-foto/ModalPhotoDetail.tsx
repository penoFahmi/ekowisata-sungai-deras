import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Download, Eye, Heart, Loader2, Calendar, ShieldCheck } from 'lucide-react';

interface PhotoDetail {
  id: number;
  title: string;
  description: string | null;
  category: 'kerajinan' | 'wisata';
  tags: { name: string, slug: string }[];
  image_path: string;
  downloads: number;
  likes: number;
  views: number;
  user: { name: string };
  created_at: string;
  is_liked: boolean;
}

interface ModalPhotoDetailProps {
  isOpen: boolean;
  onClose: () => void;
  photo: PhotoDetail | null;
  onLike: (id: number) => void;
  onDownload: (id: number) => void;
  onTagClick?: (tagSlug: string) => void;
}

export default function ModalPhotoDetail({ isOpen, onClose, photo, onLike, onDownload, onTagClick }: ModalPhotoDetailProps) {
  if (!photo) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl p-0 bg-transparent border-none shadow-none flex items-center justify-center">
          <Loader2 className="h-16 w-16 text-white animate-spin" />
        </DialogContent>
      </Dialog>
    );
  }

  const getCategoryGradient = (category: string) => {
    return category === "kerajinan"
      ? "from-amber-500 to-orange-600"
      : "from-blue-500 to-purple-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* UPDATE: Modal dibuat lebih lebar di layar xl (desktop besar) */}
      <DialogContent className="w-full p-0 flex flex-col md:flex-row max-h-[90vh] overflow-hidden sm:max-w-2xl md:max-w-4xl xl:max-w-6xl">
        {/* Image Section */}
        <div className="relative md:flex-1 bg-black flex items-center justify-center overflow-hidden">
          <ImageWithFallback
            src={`/storage/${photo.image_path}`}
            alt={photo.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Details Section */}
        {/* UPDATE: Panel detail sedikit lebih lebar di layar xl */}
        <div className="w-full md:w-96 lg:w-[400px] xl:w-[480px] flex-shrink-0 bg-white flex flex-col">
          {/* UPDATE: Padding ditambah di layar md ke atas untuk spasi lebih lega */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Photographer Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${photo.user.name}&background=random`} alt={photo.user.name} />
                <AvatarFallback>{photo.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{photo.user.name}</h3>
                <p className="text-sm text-muted-foreground">Kontributor</p>
              </div>
            </div>

            {/* Photo Details */}
            <div>
              {/* UPDATE: Ukuran font judul diperbesar di layar md ke atas */}
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{photo.title}</h2>
              <p className="text-muted-foreground text-sm">{photo.description || 'Tidak ada deskripsi untuk foto ini.'}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge className={`bg-gradient-to-r ${getCategoryGradient(photo.category)} text-white border-0 shadow-md`}>
                {photo.category === "kerajinan" ? "🏺 Kerajinan" : "🏖️ Wisata"}
              </Badge>
              {photo.tags.map(tag => (
                <Badge
                  key={tag.slug}
                  variant="outline"
                  className="hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition-colors"
                  onClick={() => onTagClick?.(tag.slug)}
                >#{tag.name}</Badge>
              ))}
            </div>

            {/* Stats & Info */}
            <div className="border-t border-b py-4 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Eye className="h-5 w-5" />
                <span className="text-sm font-medium">{photo.views.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Heart className={`h-5 w-5 ${photo.is_liked ? 'text-red-500' : ''}`} />
                <span className="text-sm font-medium">{photo.likes.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Download className="h-5 w-5" />
                <span className="text-sm font-medium">{photo.downloads.toLocaleString()}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3"><Calendar className="h-4 w-4" /><span>Diunggah pada {new Date(photo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
              <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4" /><span>Lisensi gratis untuk digunakan</span></div>
            </div>
          </div>

          {/* Action Buttons (Sticky Footer) */}
          <div className="p-4 border-t bg-white mt-auto">
            {/* UPDATE: Tombol dibuat memenuhi lebar kontainer untuk tampilan lebih rapi */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onLike(photo.id)}>
                <Heart className={`mr-2 h-4 w-4 ${photo.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                {photo.is_liked ? 'Batal Suka' : 'Suka'}
              </Button>
              <Button className={`flex-1 bg-gradient-to-r ${getCategoryGradient(photo.category)}`} onClick={() => onDownload(photo.id)}>
                <Download className="mr-2 h-4 w-4" />
                Unduh
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
