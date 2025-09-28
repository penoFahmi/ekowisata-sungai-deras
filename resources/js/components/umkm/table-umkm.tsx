import React from 'react';
import { Umkm } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TableUmkmProps {
    umkms: Umkm[];
    onEdit: (umkm: Umkm) => void;
    onDelete: (umkm: Umkm) => void;
}

export default function TableUmkm({ umkms, onEdit, onDelete }: TableUmkmProps) {
    const getImageUrl = (path: string) => {
        return path ? `/storage/${path}` : '/default-image.jpg';
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Gambar</TableHead>
                    <TableHead>Nama UMKM</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>No. Telepon</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {umkms.length > 0 ? (
                    umkms.map((umkm) => (
                        <TableRow key={umkm.id}>
                            <TableCell>
                                <Avatar className="h-12 w-12 rounded-md">
                                    <AvatarImage
                                        src={getImageUrl(umkm.galleries[0]?.path)}
                                        alt={umkm.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="rounded-md">
                                        {umkm.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{umkm.name}</TableCell>
                            <TableCell>{umkm.category.name}</TableCell>
                            <TableCell>{umkm.owner_name}</TableCell>
                            <TableCell>{umkm.phone_number || '-'}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Buka menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(umkm)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(umkm)} className="text-destructive">
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
