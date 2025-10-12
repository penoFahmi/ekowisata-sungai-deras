import { useState } from "react";
import { Umkm } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, Star, MapPin, ArrowRight, Filter } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

interface UMKMSectionProps {
    umkms: Umkm[];
    onSelectUmkm: (umkm: Umkm) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

export function UMKMSection({ umkms, onSelectUmkm }: UMKMSectionProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");

    const umkmCategories = ["Semua", ...Array.from(new Set(umkms.map(item => item.category.name)))];

    const filteredUMKM = umkms.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Semua" || item.category.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleWhatsApp = (umkm: Umkm) => {
        if (umkm.phone_number) {
            const phoneNumber = umkm.phone_number.replace(/[^0-9]/g, '');
            const internationalNumber = phoneNumber.startsWith('0') ? `62${phoneNumber.substring(1)}` : phoneNumber;
            window.open(`https://wa.me/${internationalNumber}?text=Halo,%20saya%20tertarik%20dengan%20produk%20dari%20${umkm.name}.`, '_blank');
        }
    };

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : 'https://placehold.co/600x400/png?text=UMKM';
    };

    return (
        <section id="umkm" className="py-24 bg-stone-100 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-teal-900 dark:text-teal-200 mb-4">
                        Direktori UMKM Desa Sungai Deras
                    </h2>
                    <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                        Dukung ekonomi lokal dengan membeli produk berkualitas dari UMKM desa.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                        <Input
                            placeholder="Cari UMKM atau produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white dark:bg-slate-800 border-stone-300 dark:border-slate-700"
                        />
                    </div>

                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                        <Filter className="w-5 h-5 text-stone-500 flex-shrink-0" />
                        <div className="flex flex-nowrap gap-2">
                            {umkmCategories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className={`text-sm flex-shrink-0 ${selectedCategory === category ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-white dark:bg-slate-800 border-stone-300 dark:border-slate-700'}`}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    {filteredUMKM.map((umkm) => (
                        <motion.div variants={cardVariants} key={umkm.id}>
                            <Card className="group bg-white dark:bg-slate-800 hover:shadow-2xl transition-shadow duration-300 overflow-hidden h-full flex flex-col border border-stone-200 dark:border-slate-700 hover:border-amber-500/40">
                                <div className="relative overflow-hidden">
                                    <ImageWithFallback
                                        src={getImageUrl(umkm.galleries?.[0]?.path)}
                                        alt={umkm.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">{umkm.category.name}</Badge>
                                    </div>
                                </div>

                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-slate-200">{umkm.name}</h3>
                                    <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-2 text-sm">
                                        {umkm.description}
                                    </p>
                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center text-sm text-stone-500 dark:text-stone-400">
                                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                            <span>{umkm.address}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button type="button" onClick={() => onSelectUmkm(umkm)} variant="outline" size="sm" className="flex-1 border-stone-300 dark:border-slate-600">
                                                Lihat Detail
                                            </Button>
                                            <Button onClick={() => handleWhatsApp(umkm)} disabled={!umkm.phone_number} size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                                                Hubungi
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {filteredUMKM.length > 0 && (
                     <div className="text-center">
                        <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-base rounded-full px-8 py-6">
                            <Link href={route('umkm-list.index')}>
                                Lihat Semua UMKM
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                    </div>
                )}

                {filteredUMKM.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="mx-auto h-12 w-12 text-stone-400" />
                        <p className="mt-4 text-stone-600 dark:text-stone-400">
                            Tidak ada UMKM yang sesuai dengan pencarian Anda.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
