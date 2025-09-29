import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem, TourismSpot, Umkm } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Store, Calendar, Users, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

interface DashboardPageProps extends PageProps {
    stats: {
        total_wisata: number;
        total_umkm: number;
        total_agenda: number;
        total_users: number;
    };
    recent_activities: {
        latest_wisata: TourismSpot[];
        latest_umkm: Umkm[];
    };
}

export default function Dashboard() {
    const { stats, recent_activities } = usePage<DashboardPageProps>().props;

    const getImageUrl = (path: string | undefined) => {
        return path ? `/storage/${path}` : '/default-image.jpg';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4 md:p-8 space-y-8">
                {/* Bagian Statistik */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Wisata" value={stats.total_wisata} icon={<MapPin className="h-4 w-4 text-muted-foreground" />} description="Jumlah destinasi wisata" />
                    <StatCard title="Total UMKM" value={stats.total_umkm} icon={<Store className="h-4 w-4 text-muted-foreground" />} description="Jumlah UMKM terdaftar" />
                    <StatCard title="Total Agenda" value={stats.total_agenda} icon={<Calendar className="h-4 w-4 text-muted-foreground" />} description="Jumlah acara & kegiatan" />
                    <StatCard title="Total Pengguna" value={stats.total_users} icon={<Users className="h-4 w-4 text-muted-foreground" />} description="Jumlah pengguna sistem" />
                </div>

                {/* Bagian Aktivitas Terbaru */}
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Wisata Baru Ditambahkan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recent_activities.latest_wisata.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 rounded-md">
                                        <AvatarImage src={getImageUrl(item.galleries[0]?.path)} />
                                        <AvatarFallback className="rounded-md">{item.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.category.name}</p>
                                    </div>
                                </div>
                            ))}
                            {recent_activities.latest_wisata.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center">Belum ada data wisata.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                UMKM Baru Ditambahkan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recent_activities.latest_umkm.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 rounded-md">
                                        <AvatarImage src={getImageUrl(item.galleries[0]?.path)} />
                                        <AvatarFallback className="rounded-md">{item.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.category.name}</p>
                                    </div>
                                </div>
                            ))}
                             {recent_activities.latest_umkm.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center">Belum ada data UMKM.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

