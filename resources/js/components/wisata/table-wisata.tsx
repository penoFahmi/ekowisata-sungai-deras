import React from 'react';
import { TourismSpot } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TableWisataProps {
    tourismSpots: TourismSpot[];
    onEdit: (spot: TourismSpot) => void;
    onDelete: (spot: TourismSpot) => void;
}

export default function TableWisata({ tourismSpots, onEdit, onDelete }: TableWisataProps) {
    const getImageUrl = (path: string) => {
        return `/storage/${path}`;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Gambar</TableHead>
                    <TableHead>Nama Wisata</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tourismSpots.length > 0 ? (
                    tourismSpots.map((spot) => (
                        <TableRow key={spot.id}>
                            <TableCell>
                                <Avatar className="h-12 w-12 rounded-md">
                                    <AvatarImage
                                        src={getImageUrl(spot.galleries[0]?.path)}
                                        alt={spot.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="rounded-md">
                                        {spot.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{spot.name}</TableCell>
                            <TableCell>{spot.category.name}</TableCell>
                            <TableCell className="max-w-xs truncate">{spot.description}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Buka menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(spot)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(spot)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Tidak ada data.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
