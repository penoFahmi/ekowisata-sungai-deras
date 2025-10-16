import React from 'react';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Category } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { route } from 'ziggy-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModalFormCategoryProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category;
    onSuccess?: () => void;
}

export default function ModalFormCategory({ isOpen, onClose, category, onSuccess }: ModalFormCategoryProps) {
    const isEditMode = !!category;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: category?.name ?? '',
        type: category?.type ?? 'wisata',
    });

    React.useEffect(() => {
        if (isOpen) {
            if (isEditMode && category) {
                setData({
                    name: category.name,
                    type: category.type,
                });
            } else {
                reset();
                setData('type', 'wisata'); // Set default value for new category
            }
        } else {
            // Reset form when modal is closed
            setData({
                name: '',
                type: 'wisata',
            });
        }
    }, [isOpen, category, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const callback = {
            onSuccess: () => {
                reset();
                onClose();
                onSuccess && onSuccess();
            },
            preserveScroll: true,
        };

        if (isEditMode) {
            put(route('kategori.update', category!.id), callback);
        } else {
            post(route('kategori.store'), callback);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* UPDATE 1: Tambahkan class untuk layout flex dan batasi tinggi maksimum modal */}
            <DialogContent
                className="sm:max-w-[425px] flex flex-col max-h-[90vh]"
                onInteractOutside={e => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
                </DialogHeader>

                {/* UPDATE 2: Buat area konten yang bisa di-scroll */}
                <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
                    <form onSubmit={handleSubmit} id="category-form" className="grid gap-4">
                        {/* Nama Kategori */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nama Kategori</Label>
                            <div className="col-span-3">
                                <Input id="name" name="name" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full" />
                                <InputError message={errors.name} className="mt-1" />
                            </div>
                        </div>

                        {/* Tipe Kategori */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Tipe</Label>
                            <div className="col-span-3">
                                <Select value={data.type} onValueChange={(value) => setData('type', value as 'wisata' | 'umkm')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wisata">Wisata</SelectItem>
                                        <SelectItem value="umkm">UMKM</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} className="mt-1" />
                            </div>
                        </div>
                    </form>
                </div>

                {/* UPDATE 3: Pindahkan footer ke luar area scroll dan hubungkan tombol submit ke form */}
                <DialogFooter className="pt-4 mt-auto border-t">
                    <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                    <Button type="submit" form="category-form" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? 'Simpan Perubahan' : 'Simpan Kategori'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
