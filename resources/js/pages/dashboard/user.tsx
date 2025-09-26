import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps, Role, UserWithRoles } from '@/types';
import AppLayout from '@/layouts/app-layout';
import TableUser from '../../components/user/table-user';
import ModalFormUser from '../../components/user/ModalFormUser';
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
import { type BreadcrumbItem } from '@/types';
import {route} from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Wisata',
        href: '/users',
    },
];
interface UserPageProps extends PageProps {
    users: UserWithRoles[];
    roles: Role[];
}

export default function User() {
    const { users, roles, flash } = usePage<UserPageProps>().props;

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
                        <div className="flex justify-between items-center">
                            <CardTitle>Daftar Pengguna</CardTitle>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" /> Tambah User
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TableUser
                            users={users}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
