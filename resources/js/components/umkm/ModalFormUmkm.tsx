import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Umkm, Category } from '@/types';
import { route } from 'ziggy-js';

interface ModalFormUmkmProps {
    isOpen: boolean;
    onClose: () => void;
    umkm?: Umkm;
    categories: Category[];
    onSuccess: () => void;
}

export default function ModalFormUmkm({ isOpen, onClose, umkm, categories, onSuccess }: ModalFormUmkmProps) {
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        _method: umkm ? 'PUT' : 'POST',
        name: umkm?.name || '',
        category_id: umkm?.category.id.toString() || '',
        description: umkm?.description || '',
        owner_name: umkm?.owner_name || '',
        phone_number: umkm?.phone_number || '',
        address: umkm?.address || '',
        latitude: umkm?.latitude || '',
        longitude: umkm?.longitude || '',
        images: [] as File[],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (umkm) {
                setData({
                    _method: 'PUT',
                    name: umkm.name,
                    category_id: umkm.category.id.toString(),
                    description: umkm.description,
                    owner_name: umkm.owner_name,
                    phone_number: umkm.phone_number,
                    address: umkm.address,
                    latitude: umkm.latitude,
                    longitude: umkm.longitude,
                    images: [],
                });
                setImagePreviews(umkm.galleries.map(img => `/storage/${img.path}`));
            } else {
                reset();
                setImagePreviews([]);
            }
        }
    }, [umkm, isOpen]);

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
        const url = umkm ? route('umkm.update', umkm.id) : route('umkm.store');

        post(url, {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            forceFormData: true, // Penting untuk upload file
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{umkm ? 'Edit UMKM' : 'Tambah UMKM'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nama UMKM</Label>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="owner_name">Nama Pemilik</Label>
                            <Input id="owner_name" value={data.owner_name} onChange={(e) => setData('owner_name', e.target.value)} />
                            {errors.owner_name && <p className="text-sm text-red-500 mt-1">{errors.owner_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="phone_number">No. Telepon</Label>
                            <Input id="phone_number" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} />
                            {errors.phone_number && <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>}
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
                        <Input id="images" type="file" multiple onChange={handleImageChange} />
                        {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images}</p>}
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
