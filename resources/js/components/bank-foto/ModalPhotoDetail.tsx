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
      {/* Modal dibuat lebih lebar di layar besar dan layoutnya fleksibel */}
      <DialogContent className="w-full p-0 flex flex-col md:flex-row max-h-[90vh] overflow-hidden sm:max-w-2xl md:max-w-4xl xl:max-w-6xl dark:bg-slate-900">
        {/* Image Section */}
        {/* Pada mobile (flex-col), gambar mengambil 40% tinggi. Pada desktop (flex-row), gambar mengambil sisa ruang (flex-1) */}
        <div className="relative h-[40vh] md:h-auto md:flex-1 bg-black flex items-center justify-center overflow-hidden">
          <ImageWithFallback
            src={`/storage/${photo.image_path}`}
            alt={photo.title}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Details Section */}
        {/* Pada mobile, panel detail mengambil 60% tinggi. Pada desktop, lebarnya tetap. */}
        <div className="w-full h-[60vh] md:h-auto md:w-96 lg:w-[400px] xl:w-[480px] flex-shrink-0 bg-white dark:bg-slate-800 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Photographer Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${photo.user.name}&background=random`} alt={photo.user.name} />
                <AvatarFallback>{photo.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{photo.user.name}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Kontributor</p>
              </div>
            </div>

            {/* Photo Details */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 break-words">{photo.title}</h2>
              <p className="text-muted-foreground text-sm dark:text-gray-400 break-words">{photo.description || 'Tidak ada deskripsi untuk foto ini.'}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className={`bg-gradient-to-r ${getCategoryGradient(photo.category)} text-white border-0 shadow-md`}>
                {photo.category === "kerajinan" ? "🏺 Kerajinan" : "🏖️ Wisata"}
              </Badge>
              {photo.tags.map(tag => (
                <Badge
                  key={tag.slug}
                  variant="outline"
                  className="hover:bg-purple-50 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-slate-300 hover:border-purple-200 cursor-pointer transition-colors"
                  onClick={() => onTagClick?.(tag.slug)}
                >#{tag.name}</Badge>
              ))}
            </div>

            {/* Stats & Info */}
            <div className="border-t border-b py-4 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1 text-muted-foreground dark:text-gray-400">
                <Eye className="h-5 w-5" />
                <span className="text-sm font-medium">{photo.views.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-muted-foreground dark:text-gray-400">
                <Heart className={`h-5 w-5 ${photo.is_liked ? 'text-red-500' : ''}`} />
                <span className="text-sm font-medium">{photo.likes.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-muted-foreground dark:text-gray-400">
                <Download className="h-5 w-5" />
                <span className="text-sm font-medium">{photo.downloads.toLocaleString()}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-sm text-muted-foreground dark:text-gray-400">
              <div className="flex items-center gap-3"><Calendar className="h-4 w-4" /><span>Diunggah pada {new Date(photo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
              <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4" /><span>Lisensi gratis untuk digunakan</span></div>
            </div>
          </div>

          {/* Action Buttons (Sticky Footer) */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-auto">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600" onClick={() => onLike(photo.id)}>
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
