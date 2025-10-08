import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Download, Eye, Heart, Loader2 } from 'lucide-react';

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
  is_liked: boolean;
}

interface ModalPhotoDetailProps {
  isOpen: boolean;
  onClose: () => void;
  photo: PhotoDetail | null;
  onLike: (id: number) => void;
  onDownload: (id: number) => void;
}

export default function ModalPhotoDetail({ isOpen, onClose, photo, onLike, onDownload }: ModalPhotoDetailProps) {
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
      <DialogContent className="sm:max-w-4xl p-0 grid grid-cols-1 md:grid-cols-3 gap-0">
        <div className="md:col-span-2 bg-black flex items-center justify-center">
          <ImageWithFallback
            src={`/storage/${photo.image_path}`}
            alt={photo.title}
            className="max-h-[90vh] w-auto object-contain"
          />
        </div>
        <div className="md:col-span-1 bg-white p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={`https://ui-avatars.com/api/?name=${photo.user.name}&background=random`} alt={photo.user.name} />
              <AvatarFallback>{photo.user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{photo.user.name}</h3>
              <p className="text-xs text-muted-foreground">Kontributor</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">{photo.title}</h2>
          <p className="text-muted-foreground text-sm mb-4 flex-grow">{photo.description || 'Tidak ada deskripsi.'}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className={`bg-gradient-to-r ${getCategoryGradient(photo.category)} text-white border-0 shadow-lg`}>
              {photo.category === "kerajinan" ? "🏺 Kerajinan" : "🏖️ Wisata"}
            </Badge>
            {photo.tags.map(tag => (
              <Badge key={tag.slug} variant="outline">{tag.name}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-around text-sm text-muted-foreground border-t border-b py-3 mb-6">
            <div className="flex flex-col items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{photo.views.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Heart className={`h-4 w-4 ${photo.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{photo.likes.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{photo.downloads.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button variant="outline" className="w-full" onClick={() => onLike(photo.id)}>
              <Heart className={`mr-2 h-4 w-4 ${photo.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
              {photo.is_liked ? 'Batal Suka' : 'Suka'}
            </Button>
            <Button className={`w-full bg-gradient-to-r ${getCategoryGradient(photo.category)}`} onClick={() => onDownload(photo.id)}>
              <Download className="mr-2 h-4 w-4" />
              Unduh
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
