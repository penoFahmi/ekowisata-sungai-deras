import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
export interface Role {
    id: number;
    name: string;
}

// User yang memiliki relasi dengan roles
export interface UserWithRoles extends User {
    roles: Role[];
}

// Tipe untuk semua props yang dikirim dari Laravel ke halaman
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    // Untuk menampung flash message dari Laravel
    flash: {
        success?: string;
        error?: string;
    }
};

// Tipe untuk model Category
export interface Category {
    id: number;
    name: string;
    type: 'wisata' | 'umkm';
    created_at: string;
    updated_at: string;
}
