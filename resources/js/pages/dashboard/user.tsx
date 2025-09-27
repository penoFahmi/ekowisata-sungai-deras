import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps, Role, UserWithRoles, PaginatedResponse } from '@/types';
import AppLayout from '@/layouts/app-layout';
import TableUser from '../../components/user/table-user';
import ModalFormUser from '../../components/user/ModalFormUser';
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
import { type BreadcrumbItem } from '@/types';
import {route} from 'ziggy-js';
import { useDebounce } from 'use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '/users',
    },
];
interface UserPageProps extends PageProps {
    users: PaginatedResponse<UserWithRoles>;
    roles: Role[];
    filters: {
        search: string;
    }
}

export default function User() {
    const { users, roles, filters, flash } = usePage<UserPageProps>().props;

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
        router.get(route('users.index'), params, {
            preserveState: true,
            replace: true,
            preserveScroll: true, // Tambahkan ini agar tidak scroll ke atas saat mencari
        });
    }, [debouncedSearchTerm]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserWithRoles | undefined>(undefined);
    const [userToDelete, setUserToDelete] = useState<UserWithRoles | null>(null);

    const handleAdd = () => {
        setEditingUser(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (user: UserWithRoles) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (user: UserWithRoles) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(route('users.destroy', userToDelete.id), {
                onSuccess: () => setUserToDelete(null),
                preserveScroll: true,
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(undefined);
    };

    // Tambahkan onSuccess agar modal tertutup setelah submit
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingUser(undefined);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User" />

            {/* MODAL UNTUK TAMBAH & EDIT */}
            <ModalFormUser
                isOpen={isModalOpen}
                onClose={closeModal}
                roles={roles}
                user={editingUser}
                onSuccess={handleSuccess} // pastikan ModalFormUser memanggil ini setelah sukses
            />

            {/* DIALOG KONFIRMASI HAPUS */}
            <AlertDialog open={userToDelete !== null} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus user "{userToDelete?.name}" secara permanen. Data tidak bisa dikembalikan.
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
                                <CardTitle>Manajemen Pengguna</CardTitle>
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
                        <TableUser
                            users={users.data}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {users.links.map((link, index) => (
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
