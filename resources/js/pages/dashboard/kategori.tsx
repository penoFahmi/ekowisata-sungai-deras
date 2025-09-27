import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps, Category, type BreadcrumbItem, PaginatedResponse } from '@/types';
import AppLayout from '@/layouts/app-layout';
import TableCategory from '@/components/kategori/table-category';
import ModalFormCategory from '@/components/kategori/ModalFormCategory';
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
import {route} from 'ziggy-js';
import { useDebounce } from 'use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Kategori',
        href: '/kategori',
    },
];

interface KategoriPageProps extends PageProps {
    categories: PaginatedResponse<Category>;
    filters: {
        search: string;
    }
}

export default function Kategori() {
    const { categories, filters, flash } = usePage<KategoriPageProps>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);


    useEffect(() => {
        // Hindari menjalankan efek pada render awal
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params: { search?: string } = {};
        if (debouncedSearchTerm) {
            params.search = debouncedSearchTerm;
        }
        router.get(route('kategori.index'), params, {
            preserveState: true,
            replace: true,
            preserveScroll: true, // Tambahkan ini agar tidak scroll ke atas saat mencari
        });
    }, [debouncedSearchTerm]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const handleAdd = () => {
        setEditingCategory(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (category: Category) => {
        setCategoryToDelete(category);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            router.delete(route('kategori.destroy', categoryToDelete.id), {
                onSuccess: () => setCategoryToDelete(null),
                preserveScroll: true,
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(undefined);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kategori" />

            <ModalFormCategory
                isOpen={isModalOpen}
                onClose={closeModal}
                category={editingCategory}
            />

            <AlertDialog open={categoryToDelete !== null} onOpenChange={() => setCategoryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus kategori "{categoryToDelete?.name}" secara permanen. Data tidak bisa dikembalikan.
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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle>Manajemen Kategori</CardTitle>
                                <CardDescription>Kelola kategori untuk tempat wisata dan produk UMKM.</CardDescription>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama kategori..."
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
                        <TableCategory
                            categories={categories.data}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {categories.links.map((link, index) => (
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
