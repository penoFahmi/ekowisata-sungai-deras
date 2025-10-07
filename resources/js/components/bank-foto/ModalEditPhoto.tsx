import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';
import { PageProps } from '@/types';

interface Photo {
    id: number;
    title: string;
    description: string | null;
    category: 'kerajinan' | 'wisata';
    tags: { name: string, slug: string }[];
}

interface ModalEditPhotoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    photo: Photo | null;
}

export default function ModalEditPhoto({ isOpen, onClose, onSuccess, photo }: ModalEditPhotoProps) {
    const { availableTags } = usePage<PageProps & { availableTags: { name: string, slug: string }[] }>().props;

    const { data, setData, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: '',
        tags: [] as string[],
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (photo) {
            setData({
                title: photo.title,
                description: photo.description || '',
                category: photo.category,
                tags: photo.tags.map(t => t.name),
            });
        } else {
            reset();
        }
    }, [photo]);

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (!data.tags.includes(newTag)) {
                setData('tags', [...data.tags, newTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!photo) return;
        put(route('bank-foto.update', photo.id), {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Detail Foto</DialogTitle>
                    <DialogDescription>Perbarui informasi mengenai foto Anda.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Foto</Label>
                        <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                        <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Select onValueChange={value => setData('category', value)} value={data.category}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="wisata">Wisata</SelectItem>
                                <SelectItem value="kerajinan">Kerajinan</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Opsional)</Label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                            {data.tags.map(tag => (
                                <div key={tag} className="flex items-center gap-1 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                    {tag} <button type="button" onClick={() => removeTag(tag)} className="text-purple-500 hover:text-purple-700"><X size={14} /></button>
                                </div>
                            ))}
                            <Input id="tags" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Ketik tag lalu tekan Enter..." className="flex-1 border-none shadow-none focus-visible:ring-0" />
                        </div>
                        {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
