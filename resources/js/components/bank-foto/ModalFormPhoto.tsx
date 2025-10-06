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

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface ModalFormPhotoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface SharedProps extends PageProps {
    availableTags: Tag[];
}

export default function ModalFormPhoto({ isOpen, onClose, onSuccess }: ModalFormPhotoProps) {
    const { availableTags } = usePage<SharedProps>().props;

    const { data, setData, post, processing, errors, progress, reset } = useForm({
        title: '',
        description: '',
        category: '',
        image: null as File | null,
        tags: [] as string[],
    });

    const [tagInput, setTagInput] = useState('');
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    useEffect(() => {
        if (data.image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(data.image);
        } else {
            setPreview(null);
        }
    }, [data.image]);

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
        post(route('bank-foto.store'), {
            forceFormData: true,
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
                    <DialogTitle>Upload Foto Baru</DialogTitle>
                    <DialogDescription>Bagikan foto kerajinan atau wisata terbaik Anda ke Bank Foto Digital.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Foto</Label>
                        <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Contoh: Pemandangan Senja di Sungai Deras" />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                        <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Ceritakan sedikit tentang foto Anda..." />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Select onValueChange={value => setData('category', value)} value={data.category}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wisata">Wisata</SelectItem>
                                    <SelectItem value="kerajinan">Kerajinan</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">File Gambar</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    setData('image', file);
                                }}
                            />
                            {preview && <img src={preview} alt="Preview" className="mt-2 rounded-md max-h-48 object-cover" />}
                            {progress && (
                                <div className="w-full bg-gray-200 rounded-full mt-2">
                                    <div className="bg-purple-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress.percentage}%` }} />
                                </div>
                            )}
                            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Opsional)</Label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                            {data.tags.map(tag => (
                                <div key={tag} className="flex items-center gap-1 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                    {tag}
                                    <Button type="button" onClick={() => removeTag(tag)} className="text-purple-500 hover:text-purple-700">
                                        <X size={14} />
                                    </Button>
                                </div>
                            ))}
                            <Input
                                id="tags"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Ketik tag lalu tekan Enter..."
                                className="flex-1 border-none shadow-none focus-visible:ring-0"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Saran: {availableTags.slice(0, 5).map(t => t.name).join(', ')}
                        </p>
                        {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upload Foto
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
