import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, user, kategori, wisata, umkm, agenda, setting } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Users, FolderOpen, LayoutGrid, MapPin, Settings, Calendar, Store } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
        {
        title: 'Manajemen User',
        href: user(),
        icon: Users,
    },
        {
        title: 'Manajemen Kategori',
        href: kategori(),
        icon: FolderOpen,
    },
        {
        title: 'Manajemen Wisata',
        href: wisata(),
        icon: MapPin,
    },
        {
        title: 'Manajemen UMKM',
        href: umkm(),
        icon: Store,
    },
        {
        title: 'Manajemen Agenda',
        href: agenda(),
        icon: Calendar,
    },
        {
        title: 'Pengaturan',
        href: setting(),
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
