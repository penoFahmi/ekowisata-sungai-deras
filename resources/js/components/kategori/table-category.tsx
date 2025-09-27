import React from 'react';
import { Category } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface TableCategoryProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export default function TableCategory({ categories, onEdit, onDelete }: TableCategoryProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">
                            Tidak ada data kategori.
                        </TableCell>
                    </TableRow>
                )}
                {categories.map((category) => (
                    <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                            <Badge variant={category.type === 'wisata' ? 'default' : 'secondary'}>
                                {category.type.toUpperCase()}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(category)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => onDelete(category)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Hapus
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
