// import React, { useEffect } from 'react';
// import { useForm } from '@inertiajs/react';
// import { LoaderCircle } from 'lucide-react';
// import { Wisata, Category } from '@/types';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogDescription,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import InputError from '@/components/input-error';
// import { route } from 'ziggy-js';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';

// interface ModalFormWisataProps {
//     isOpen: boolean;
//     onClose: () => void;
//     wisata?: Wisata;
//     categories: Category[];
//     onSuccess?: () => void;
// }

// export default function ModalFormWisata({
//     isOpen,
//     onClose,
//     wisata,
//     categories,
//     onSuccess,
// }: ModalFormWisataProps) {
//     const isEditMode = !!wisata;

//     const { data, setData, post, put, processing, errors, reset, clearErrors } =
//         useForm<{
//             name: string;
//             description: string;
//             address: string;
//             latitude: string;
//             longitude: string;
//             price: string;
//             category_id: string;
//             images: File[];
//             _method?: string;
//         }>({
//             name: '',
//             description: '',
//             address: '',
//             latitude: '',
//             longitude: '',
//             price: '0',
//             category_id: '',
//             images: [],
//         });

//     useEffect(() => {
//         if (isOpen) {
//             clearErrors();
//             if (isEditMode && wisata) {
//                 setData({
//                     name: wisata.name,
//                     description: wisata.description,
//                     address: wisata.address,
//                     latitude: wisata.latitude,
//                     longitude: wisata.longitude,
//                     price: String(wisata.price),
//                     category_id: String(wisata.category_id),
//                     images: [],
//                 });
//             } else {
//                 reset();
//             }
//         }
//     }, [isOpen, wisata, isEditMode]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         const handleSuccess = () => {
//             reset();
//             onClose();
//             onSuccess?.();
//         };

//         if (isEditMode) {
//             // Inertia doesn't handle PUT with multipart/form-data, so we use POST with _method=PUT
//             post(route('wisata.update', wisata!.id), {
//                 onSuccess: handleSuccess,
//                 forceFormData: true,
//             });
//         } else {
//             post(route('wisata.store'), {
//                 onSuccess: handleSuccess,
//             });
//         }
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent
//                 className="sm:max-w-2xl"
//                 onInteractOutside={e => e.preventDefault()}>
//                 <DialogHeader>
//                     <DialogTitle>
//                         {isEditMode ? 'Edit Wisata' : 'Tambah Wisata Baru'}
//                     </DialogTitle>
//                     <DialogDescription>
//                         Isi detail wisata di bawah ini.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="name" className="text-right">
//                             Nama
//                         </Label>
//                         <div className="col-span-3">
//                             <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
//                             <InputError message={errors.name} className="mt-1" />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-4 items-start gap-4">
//                         <Label htmlFor="description" className="text-right pt-2">
//                             Deskripsi
//                         </Label>
//                         <div className="col-span-3">
//                             <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
//                             <InputError message={errors.description} className="mt-1" />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="address" className="text-right">
//                             Alamat
//                         </Label>
//                         <div className="col-span-3">
//                             <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} />
//                             <InputError message={errors.address} className="mt-1" />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="grid grid-cols-2 items-center gap-4">
//                             <Label htmlFor="latitude" className="text-right">Latitude</Label>
//                             <Input id="latitude" value={data.latitude} onChange={e => setData('latitude', e.target.value)} />
//                             <InputError message={errors.latitude} className="col-span-2 mt-1" />
//                         </div>
//                         <div className="grid grid-cols-2 items-center gap-4">
//                             <Label htmlFor="longitude" className="text-right">Longitude</Label>
//                             <Input id="longitude" value={data.longitude} onChange={e => setData('longitude', e.target.value)} />
//                             <InputError message={errors.longitude} className="col-span-2 mt-1" />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="price" className="text-right">Harga Tiket</Label>
//                         <div className="col-span-3">
//                             <Input id="price" type="number" value={data.price} onChange={e => setData('price', e.target.value)} />
//                             <InputError message={errors.price} className="mt-1" />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="category_id" className="text-right">Kategori</Label>
//                         <div className="col-span-3">
//                             <Select value={data.category_id} onValueChange={value => setData('category_id', value)}>
//                                 <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
//                                 <SelectContent>
//                                     {categories.map(cat => (
//                                         <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             <InputError message={errors.category_id} className="mt-1" />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-4 items-start gap-4">
//                         <Label htmlFor="images" className="text-right pt-2">Gambar</Label>
//                         <div className="col-span-3">
//                             <Input id="images" type="file" multiple onChange={e => setData('images', Array.from(e.target.files || []))} />
//                             <InputError message={errors.images} className="mt-1" />
//                         </div>
//                     </div>

//                     <DialogFooter>
//                         <Button type="submit" disabled={processing}>
//                             {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
//                             {isEditMode ? 'Simpan Perubahan' : 'Simpan Wisata'}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }

