import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps, TourismSpot, Category, PaginatedResponse, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Plus, Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { route } from 'ziggy-js';
import { useDebounce } from 'use-debounce';
import TableWisata from '@/components/wisata/table-wisata';
import ModalFormWisata from '@/components/wisata/ModalFormWisata';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Wisata',
        href: '/wisata',
    },
];

interface WisataPageProps extends PageProps {
    tourismSpots: PaginatedResponse<TourismSpot>;
    categories: Category[];
    filters: {
        search: string;
    }
}

export default function Wisata() {
    const { tourismSpots, categories, filters, flash } = usePage<WisataPageProps>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params: { search?: string } = {};
        if (debouncedSearchTerm) {
            params.search = debouncedSearchTerm;
        }
        router.get(route('wisata.index'), params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [debouncedSearchTerm]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWisata, setEditingWisata] = useState<TourismSpot | undefined>(undefined);
    const [wisataToDelete, setWisataToDelete] = useState<TourismSpot | null>(null);

    const handleAdd = () => {
        setEditingWisata(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (wisata: TourismSpot) => {
        setEditingWisata(wisata);
        setIsModalOpen(true);
    };

    const handleDelete = (wisata: TourismSpot) => {
        setWisataToDelete(wisata);
    };

    const confirmDelete = () => {
        if (wisataToDelete) {
            router.delete(route('wisata.destroy', wisataToDelete.id), {
                onSuccess: () => setWisataToDelete(null),
                preserveScroll: true,
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingWisata(undefined);
    };

    const handleSuccess = () => {
        closeModal();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Wisata" />

            <ModalFormWisata
                isOpen={isModalOpen}
                onClose={closeModal}
                wisata={editingWisata}
                categories={categories}
                onSuccess={handleSuccess}
            />

            <AlertDialog open={wisataToDelete !== null} onOpenChange={() => setWisataToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data wisata "{wisataToDelete?.name}" secara permanen.
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

            <div className="p-4 md:p-8">
                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                        {flash.success}
                    </div>
                )}
                <Card>
                    <CardHeader>
                        {/* Header content with search and add button will be here */}
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                    <div>
                                                        <CardTitle>Manajemen Wisata</CardTitle>
                                                        <CardDescription>Kelola Wisata yang ada di desa sungai deras</CardDescription>
                                                    </div>
                                                    <div className="flex gap-2 w-full md:w-auto">
                                                        <div className="relative w-full md:w-64">
                                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                type="search"
                                                                placeholder="Cari nama wisata..."
                                                                className="pl-8 w-full"
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                            />
                                                        </div>
                                                        <Button onClick={handleAdd} className="flex-shrink-0">
                                                            <Plus className="mr-2 h-4 w-4" /> Tambah
                                                        </Button>
                                                    </div>
                                                </div>
                    </CardHeader>
                    <CardContent>
                        <TableWisata
                            tourismSpots={tourismSpots.data}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {tourismSpots.links.map((link, index) => (
                                    <PaginationItem key={index} className={!link.url ? 'hidden' : ''}>
                                        <PaginationLink href={link.url || '#'} isActive={link.active} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
