import React from 'react';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Role, UserWithRoles } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { route } from 'ziggy-js';

interface ModalFormUserProps {
    isOpen: boolean;
    onClose: () => void;
    roles: Role[];
    user?: UserWithRoles;
    onSuccess?: () => void;
}

export default function ModalFormUser({ isOpen, onClose, roles, user, onSuccess }: ModalFormUserProps) {
    const isEditMode = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        roles: user?.roles.map(r => r.id) ?? [],
    });

    React.useEffect(() => {
        if (isEditMode) {
            setData({
                name: user?.name ?? '',
                email: user?.email ?? '',
                password: '',
                password_confirmation: '',
                roles: user?.roles.map(r => r.id) ?? [],
            });
        } else {
            setData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                roles: [],
            });
        }
    }, [isOpen, user]);

    const handleRoleChange = (roleId: number) => {
        setData('roles', data.roles.includes(roleId)
            ? data.roles.filter((id) => id !== roleId)
            : [...data.roles, roleId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('users.update', user!.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                    onSuccess && onSuccess();
                },
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                    onSuccess && onSuccess();
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Name */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nama</Label>
                        <div className="col-span-3">
                            <Input id="name" name="name" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full" />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <div className="col-span-3">
                            <Input id="email" name="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full" />
                            <InputError message={errors.email} className="mt-1" />
                        </div>
                    </div>
                    {/* Password */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">Password</Label>
                        <div className="col-span-3">
                            <Input id="password" name="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder={isEditMode ? 'Isi untuk ganti' : ''} className="w-full" />
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                    </div>
                    {/* Password Confirmation */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password_confirmation" className="text-right">Konfirmasi</Label>
                        <div className="col-span-3">
                            <Input id="password_confirmation" name="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full" />
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
                                        checked={data.roles.includes(role.id)}
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
                </form>
            </DialogContent>
        </Dialog>
    );
}
