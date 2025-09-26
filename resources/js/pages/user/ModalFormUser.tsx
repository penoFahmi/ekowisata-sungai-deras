import React from 'react';
import { Form } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Role, UserWithRoles } from '@/types';

// INI KUNCINYA: Import controller dari folder actions
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';

interface ModalFormUserProps {
    isOpen: boolean;
    onClose: () => void;
    roles: Role[];
    user?: UserWithRoles; // Opsional, untuk mode edit
}

export default function ModalFormUser({ isOpen, onClose, roles, user }: ModalFormUserProps) {
    // Menentukan apakah ini mode edit atau create
    const isEditMode = user !== undefined;

    // Menyiapkan form dengan pola Actions
    // Jika mode edit, siapkan data awal. Jika tidak, form kosong.
    const form = isEditMode
        ? UserController.update.form(user.id, {
              ...user,
              roles: user.roles.map(role => role.id), // Kirim ID roles
              password: '', // Kosongkan password
              password_confirmation: '',
          })
        : UserController.store.form({
              name: '',
              email: '',
              password: '',
              password_confirmation: '',
              roles: [],
          });

    const handleRoleChange = (roleId: number) => {
        const currentRoles = form.data.roles;
        const newRoles = currentRoles.includes(roleId)
            ? currentRoles.filter((id) => id !== roleId)
            : [...currentRoles, roleId];
        form.setData('roles', newRoles);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
                </DialogHeader>
                <Form
                    {...form.props} // <- Menggunakan props dari form Actions
                    onSuccess={onClose} // Tutup modal jika berhasil
                    className="grid gap-4 py-4"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Name */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nama</Label>
                                <div className="col-span-3">
                                    <Input id="name" name="name" className="w-full" />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                            </div>
                            {/* Email */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <div className="col-span-3">
                                    <Input id="email" name="email" type="email" className="w-full" />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>
                            </div>
                            {/* Password */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">Password</Label>
                                <div className="col-span-3">
                                    <Input id="password" name="password" type="password" placeholder={isEditMode ? 'Isi untuk ganti' : ''} className="w-full" />
                                    <InputError message={errors.password} className="mt-1" />
                                </div>
                            </div>
                            {/* Password Confirmation */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password_confirmation" className="text-right">Konfirmasi</Label>
                                <div className="col-span-3">
                                    <Input id="password_confirmation" name="password_confirmation" type="password" className="w-full" />
                                </div>
                            </div>
                            {/* Roles */}
                             <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Roles</Label>
                                <div className="col-span-3 space-y-2">
                                    {roles.map(role => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={form.data.roles.includes(role.id)}
                                                onCheckedChange={() => handleRoleChange(role.id)}
                                            />
                                            <label htmlFor={`role-${role.id}`} className="text-sm font-medium leading-none">
                                                {role.name}
                                            </label>
                                        </div>
                                    ))}
                                    <InputError message={errors.roles} className="mt-1" />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditMode ? 'Simpan Perubahan' : 'Simpan User'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
