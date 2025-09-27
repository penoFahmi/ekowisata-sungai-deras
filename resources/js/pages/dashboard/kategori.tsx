import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps, Category, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import TableCategory from '@/components/kategori/table-category';
import ModalFormCategory from '@/components/kategori/ModalFormCategory';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Kategori',
        href: '/kategori',
    },
];

interface KategoriPageProps extends PageProps {
    categories: Category[];
}

export default function Kategori() {
    const { categories, flash } = usePage<KategoriPageProps>().props;

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
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Daftar Kategori</CardTitle>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TableCategory
                            categories={categories}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
