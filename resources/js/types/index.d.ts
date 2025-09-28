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

// Tipe untuk model Gallery
export interface Gallery {
    id: number;
    path: string;
}

// Tipe untuk model TourismSpot
export interface TourismSpot {
    id: number;
    name: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    category: Category;
    galleries: Gallery[];
}

// Tipe untuk model Umkm
export interface Umkm {
    id: number;
    name: string;
    description: string;
    owner_name: string;
    phone_number: string;
    address: string;
    latitude: string;
    longitude: string;
    category: Category;
    galleries: Gallery[];
}

// Tipe untuk model Agenda
export interface Agenda {
    id: number;
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    poster_image_path: string | null;
}


// Tipe untuk response paginasi dari Laravel
export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}
