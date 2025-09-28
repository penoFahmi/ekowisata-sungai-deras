import React from 'react';
import { Agenda } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TableAgendaProps {
    agendas: Agenda[];
    onEdit: (agenda: Agenda) => void;
    onDelete: (agenda: Agenda) => void;
}

export default function TableAgenda({ agendas, onEdit, onDelete }: TableAgendaProps) {
    const getImageUrl = (path: string | null) => {
        return path ? `/storage/${path}` : '/default-image.jpg';
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Poster</TableHead>
                    <TableHead>Judul Agenda</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Waktu Mulai</TableHead>
                    <TableHead>Waktu Selesai</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {agendas.length > 0 ? (
                    agendas.map((agenda) => (
                        <TableRow key={agenda.id}>
                            <TableCell>
                                <Avatar className="h-12 w-12 rounded-md">
                                    <AvatarImage
                                        src={getImageUrl(agenda.poster_image_path)}
                                        alt={agenda.title}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="rounded-md">
                                        {agenda.title.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{agenda.title}</TableCell>
                            <TableCell>{agenda.location}</TableCell>
                            <TableCell>{formatDate(agenda.start_time)}</TableCell>
                            <TableCell>{formatDate(agenda.end_time)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Buka menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(agenda)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(agenda)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Tidak ada data.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
