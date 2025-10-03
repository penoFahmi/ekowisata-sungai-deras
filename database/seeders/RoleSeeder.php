<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role; // Pastikan Model Role sudah di-import

class RoleSeeder extends Seeder
{
    /**
     * Jalankan proses seeding untuk database.
     */
    public function run(): void
    {
        // 1. Kosongkan tabel roles terlebih dahulu untuk menghindari duplikasi
        // jika seeder dijalankan lebih dari sekali.
        Role::query()->delete();

        // 2. Definisikan semua role yang kita butuhkan dalam sebuah array
        $roles = [
            [
                'name' => 'administrator',
                'display_name' => 'Administrator',
            ],
            [
                'name' => 'pengelola-wisata',
                'display_name' => 'Pengelola Wisata',
            ],
            [
                'name' => 'pengelola-umkm',
                'display_name' => 'Pengelola UMKM',
            ],
            [
                'name' => 'pengelola-bank-foto-digital',
                'display_name' => 'Pengelola Foto Digital',
            ],
            [
                'name' => 'user-terdaftar',
                'display_name' => 'User Terdaftar',
            ],
        ];

        // 3. Looping array dan buat record untuk setiap role
        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
