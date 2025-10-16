import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TourismSpot, Category } from '@/types';
import { route } from 'ziggy-js';

interface ModalFormWisataProps {
    isOpen: boolean;
    onClose: () => void;
    wisata?: TourismSpot;
    categories: Category[];
    onSuccess: () => void;
}

export default function ModalFormWisata({ isOpen, onClose, wisata, categories, onSuccess }: ModalFormWisataProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: wisata ? 'PUT' : 'POST',
        name: wisata?.name || '',
        category_id: wisata?.category.id.toString() || '',
        description: wisata?.description || '',
        address: wisata?.address || '',
        latitude: wisata?.latitude || '',
        longitude: wisata?.longitude || '',
        images: [] as File[],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (wisata) {
                setData({
                    _method: 'PUT',
                    name: wisata.name,
                    category_id: wisata.category.id.toString(),
                    description: wisata.description,
                    address: wisata.address,
                    latitude: wisata.latitude,
                    longitude: wisata.longitude,
                    images: [],
                });
                setImagePreviews(wisata.galleries.map(img => `/storage/${img.path}`));
            } else {
                reset();
                setImagePreviews([]);
            }
        }
    }, [wisata, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData('images', files);
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = wisata ? route('wisata.update', wisata.id) : route('wisata.store');

        post(url, {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            forceFormData: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* UPDATE 1: Tambahkan class untuk layout flex dan batasi tinggi modal */}
            <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{wisata ? 'Edit Tempat Wisata' : 'Tambah Tempat Wisata'}</DialogTitle>
                </DialogHeader>

                {/* UPDATE 2: Bungkus form dengan div yang akan menjadi area scroll */}
                <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
                    <form onSubmit={handleSubmit} id="wisata-form" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nama Wisata</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="category_id">Kategori</Label>
                                <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <Label htmlFor="address">Alamat</Label>
                            <Textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input id="latitude" type="text" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} />
                                {errors.latitude && <p className="text-sm text-red-500 mt-1">{errors.latitude}</p>}
                            </div>
                            <div>
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input id="longitude" type="text" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} />
                                {errors.longitude && <p className="text-sm text-red-500 mt-1">{errors.longitude}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="images">Gambar (bisa lebih dari satu)</Label>
                            <Input id="images" type="file" multiple onChange={handleImageChange} accept="image/*" />
                            {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images}</p>}
                            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {imagePreviews.map((src, index) => (
                                    <img key={index} src={src} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* UPDATE 3: Pindahkan footer ke luar area scroll dan hubungkan tombol submit */}
                <DialogFooter className="pt-4 mt-auto border-t border-slate-200">
                    <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                    <Button type="submit" form="wisata-form" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
