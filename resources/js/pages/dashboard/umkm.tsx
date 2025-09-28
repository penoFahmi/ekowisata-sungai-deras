import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps, Category, PaginatedResponse, type BreadcrumbItem } from '@/types';
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
import TableUmkm from '@/components/umkm/table-umkm';
import ModalFormUmkm from '@/components/umkm/ModalFormUmkm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen UMKM',
        href: '/umkm',
    },
];

interface UmkmPageProps extends PageProps {
    umkms: PaginatedResponse<Umkm>;
    categories: Category[];
    filters: {
        search: string;
    }
}

export default function Umkm() {
    const { umkms, categories, filters, flash } = usePage<UmkmPageProps>().props;

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
        router.get(route('umkm.index'), params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [debouncedSearchTerm]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUmkm, setEditingUmkm] = useState<Umkm | undefined>(undefined);
    const [umkmToDelete, setUmkmToDelete] = useState<Umkm | null>(null);

    const handleAdd = () => {
        setEditingUmkm(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (umkm: Umkm) => {
        setEditingUmkm(umkm);
        setIsModalOpen(true);
    };

    const handleDelete = (umkm: Umkm) => {
        setUmkmToDelete(umkm);
    };

    const confirmDelete = () => {
        if (umkmToDelete) {
            router.delete(route('umkm.destroy', umkmToDelete.id), {
                onSuccess: () => setUmkmToDelete(null),
                preserveScroll: true,
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUmkm(undefined);
    };

    const handleSuccess = () => {
        closeModal();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen UMKM" />

            <ModalFormUmkm
                isOpen={isModalOpen}
                onClose={closeModal}
                umkm={editingUmkm}
                categories={categories}
                onSuccess={handleSuccess}
            />

            <AlertDialog open={umkmToDelete !== null} onOpenChange={() => setUmkmToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data UMKM "{umkmToDelete?.name}" secara permanen.
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
                                <CardTitle>Manajemen UMKM</CardTitle>
                                <CardDescription>Kelola akun pengguna, atur peran, dan hak akses untuk sistem.</CardDescription>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama atau email..."
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
                        <TableUmkm
                            umkms={umkms.data}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {umkms.links.map((link, index) => (
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
