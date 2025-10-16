import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Agenda } from '@/types';
import { route } from 'ziggy-js';

interface ModalFormAgendaProps {
    isOpen: boolean;
    onClose: () => void;
    agenda?: Agenda;
}

export default function ModalFormAgenda({ isOpen, onClose, agenda }: ModalFormAgendaProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: agenda ? 'PUT' : 'POST',
        title: '',
        description: '',
        location: '',
        start_time: '',
        end_time: '',
        poster_image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (agenda) {
                setData({
                    _method: 'PUT',
                    title: agenda.title,
                    description: agenda.description,
                    location: agenda.location,
                    start_time: agenda.start_time.substring(0, 16),
                    end_time: agenda.end_time.substring(0, 16),
                    poster_image: null,
                });
                setImagePreview(agenda.poster_image_path ? `/storage/${agenda.poster_image_path}` : null);
            } else {
                reset();
                setImagePreview(null);
            }
        }
    }, [agenda, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('poster_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = agenda ? route('agenda.update', agenda.id) : route('agenda.store');
        post(url, {
            onSuccess: () => onClose(),
            forceFormData: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* UPDATE 1: Tambahkan class untuk layout flex vertikal dan batasi tinggi maksimumnya */}
            <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{agenda ? 'Edit Agenda' : 'Tambah Agenda'}</DialogTitle>
                </DialogHeader>

                {/* UPDATE 2: Bungkus form dengan div yang akan menjadi area scroll */}
                <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
                    <form onSubmit={handleSubmit} id="agenda-form" className="space-y-4">
                        <div>
                            <Label htmlFor="title">Judul Agenda</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <Label htmlFor="location">Lokasi</Label>
                            <Input id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                            {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="start_time">Waktu Mulai</Label>
                                <Input id="start_time" type="datetime-local" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} />
                                {errors.start_time && <p className="text-sm text-red-500 mt-1">{errors.start_time}</p>}
                            </div>
                            <div>
                                <Label htmlFor="end_time">Waktu Selesai</Label>
                                <Input id="end_time" type="datetime-local" value={data.end_time} onChange={(e) => setData('end_time', e.target.value)} />
                                {errors.end_time && <p className="text-sm text-red-500 mt-1">{errors.end_time}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="poster_image">Poster Agenda</Label>
                            <Input id="poster_image" type="file" accept="image/*" onChange={handleImageChange} />
                            {errors.poster_image && <p className="text-sm text-red-500 mt-1">{errors.poster_image}</p>}
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt="Preview" className="h-40 w-auto object-cover rounded-md" />
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* UPDATE 3: Pindahkan DialogFooter ke luar area scroll dan hubungkan tombol submit ke form */}
                <DialogFooter className="pt-4 mt-auto border-t border-slate-200">
                    <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                    <Button type="submit" form="agenda-form" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
