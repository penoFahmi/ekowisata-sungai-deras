import { useMemo, useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import axios from 'axios';
import { Header } from "@/components/bank-foto/Header";
import { Footer } from "@/components/landing-page/footer";
import { PhotoGallery } from "@/components/bank-foto/PhotoGallery";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { PageProps, PaginatedResponse } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Download, Eye, Heart } from "lucide-react";
import ModalPhotoDetail from "@/components/bank-foto/ModalPhotoDetail";
import ModalEditPhoto from "@/components/bank-foto/ModalEditPhoto";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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

interface ProfilePageProps extends PageProps {
  photos: PaginatedResponse<Photo>;
  stats: {
    totalPhotos: number;
    totalLikes: number;
    totalDownloads: number;
    totalViews: number;
  };
}

export default function ProfilePage() {
  const { auth, photos, stats, flash } = usePage<ProfilePageProps>().props;
  const user = auth.user;

  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const formattedPhotos = useMemo(() => {
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

  const statItems = [
    { label: 'Total Foto', value: stats.totalPhotos, icon: Camera },
    { label: 'Total Dilihat', value: stats.totalViews, icon: Eye },
    { label: 'Total Disukai', value: stats.totalLikes, icon: Heart },
    { label: 'Total Unduhan', value: stats.totalDownloads, icon: Download },
  ];

  const handleEdit = (photoId: string) => {
    const photoToEdit = photos.data.find(p => p.id.toString() === photoId);
    if (photoToEdit) {
      setEditingPhoto(photoToEdit);
    }
  };

  const handleDelete = (photoId: string) => {
    const photoToDelete = photos.data.find(p => p.id.toString() === photoId);
    if (photoToDelete) {
      setDeletingPhoto(photoToDelete);
    }
  };

  const confirmDelete = () => {
    if (deletingPhoto) {
      router.delete(route('bank-foto.destroy', deletingPhoto.id), {
        preserveScroll: true,
        onSuccess: () => setDeletingPhoto(null),
      });
    }
  };

  const handleLike = (photoId: string) => {
    router.post(route('bank-foto.like', photoId), {}, { preserveScroll: true });
  };

  const handleDownload = (photoId: string) => {
    window.open(route('bank-foto.download', photoId), '_blank');
  };

  const handlePhotoClick = async (photoId: string) => {
    setDetailModalOpen(true);
    try {
      const response = await axios.get(route('bank-foto.show', photoId));
      setSelectedPhoto(response.data);
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <ModalEditPhoto isOpen={!!editingPhoto} onClose={() => setEditingPhoto(null)} onSuccess={() => {}} photo={editingPhoto} />
      <ModalPhotoDetail
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          photo={selectedPhoto}
          onLike={(id) => handleLike(id.toString())}
          onDownload={(id) => handleDownload(id.toString())}
      />
      <AlertDialog open={!!deletingPhoto} onOpenChange={() => setDeletingPhoto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus foto ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Foto "{deletingPhoto?.title}" akan dihapus secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-lg">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=128`} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {statItems.map((item, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-md">
              <item.icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-800">{item.value.toLocaleString('id-ID')}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Photo Gallery */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800">Foto Unggahan Saya</h2>
          <PhotoGallery
            photos={formattedPhotos}
            onPhotoClick={handlePhotoClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLike={handleLike}
            onDownload={handleDownload}
          />

          {/* Pagination */}
          {photos.meta && photos.meta.links.length > 3 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  {(photos.meta.links || []).map((link, index) => (
                    <PaginationItem key={index} className={!link.url ? 'opacity-50 pointer-events-none' : ''}>
                      <Link
                        href={link.url || '#'}
                        className={`px-4 py-2 border rounded-md ${link.active ? 'bg-purple-600 text-white border-purple-600' : 'bg-white'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserve-scroll
                      />
                    </PaginationItem>
                  ))}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
