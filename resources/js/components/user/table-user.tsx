import React from 'react';
import { UserWithRoles } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface TableUserProps {
    users: UserWithRoles[];
    onEdit: (user: UserWithRoles) => void;
    onDelete: (user: UserWithRoles) => void;
}

export default function TableUser({ users, onEdit, onDelete }: TableUserProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            Tidak ada data user.
                        </TableCell>
                    </TableRow>
                )}
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <div className="flex gap-1">
                                {user.roles.map((role) => (
                                    <Badge key={role.id} variant="secondary">
                                        {role.name}
                                    </Badge>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(user)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => onDelete(user)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Hapus
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
