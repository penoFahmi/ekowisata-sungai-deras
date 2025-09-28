import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps, PaginatedResponse, type BreadcrumbItem } from '@/types';
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
import TableAgenda from '@/components/agenda/table-agenda';
import ModalFormAgenda from '@/components/agenda/ModalFormAgenda';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Agenda',
        href: '/agenda',
    },
];

interface AgendaPageProps extends PageProps {
    agendas: PaginatedResponse<Agenda>;
    filters: {
        search: string;
    }
}

export default function Agenda() {
    const { agendas, filters, flash } = usePage<AgendaPageProps>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        router.get(route('agenda.index'), { search: debouncedSearchTerm }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [debouncedSearchTerm]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgenda, setEditingAgenda] = useState<Agenda | undefined>(undefined);
    const [agendaToDelete, setAgendaToDelete] = useState<Agenda | null>(null);

    const handleAdd = () => {
        setEditingAgenda(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (agenda: Agenda) => {
        setEditingAgenda(agenda);
        setIsModalOpen(true);
    };

    const handleDelete = (agenda: Agenda) => {
        setAgendaToDelete(agenda);
    };

    const confirmDelete = () => {
        if (agendaToDelete) {
            router.delete(route('agenda.destroy', agendaToDelete.id), {
                onSuccess: () => setAgendaToDelete(null),
                preserveScroll: true,
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Agenda" />

            <ModalFormAgenda isOpen={isModalOpen} onClose={closeModal} agenda={editingAgenda} />

            <AlertDialog open={agendaToDelete !== null} onOpenChange={() => setAgendaToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus agenda "{agendaToDelete?.title}" secara permanen.
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
                        {/* Header content will be here */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle>Manajemen Agenda</CardTitle>
                                <CardDescription>Kelola akun agenda, atur peran, dan hak akses untuk sistem.</CardDescription>
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
                        <TableAgenda agendas={agendas.data} onEdit={handleEdit} onDelete={handleDelete} />
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {agendas.links.map((link, index) => (
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
