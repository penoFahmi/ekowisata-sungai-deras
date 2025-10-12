<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Jalankan proses seeding untuk user.
     */
    public function run(): void
    {
        // 1. Ambil data role dari database untuk mendapatkan ID-nya
        $adminRole = Role::where('name', 'administrator')->first();
        $wisataRole = Role::where('name', 'pengelola-wisata')->first();
        $umkmRole = Role::where('name', 'pengelola-umkm')->first();
        $bankFotoDigitalRole = Role::where('name', 'pengelola-bank-foto-digital')->first();
        $userRole = Role::where('name', 'user-terdaftar')->first();

        // 2. Buat user Administrator
        // firstOrCreate akan membuat user hanya jika email-nya belum ada
        if ($adminRole) {
            $adminUser = User::firstOrCreate(
                ['email' => 'admin@gmail.com'],
                [
                    'name' => 'Administrator',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            // Pasangkan role 'administrator' ke user ini
            $adminUser->roles()->sync($adminRole->id);
        }

        // 3. Buat user Pengelola Wisata
        if ($wisataRole) {
            $wisataUser = User::firstOrCreate(
                ['email' => 'wisata@gmail.com'],
                [
                    'name' => 'Pengelola Wisata',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $wisataUser->roles()->sync($wisataRole->id);
        }

        // 4. Buat user Pengelola UMKM
        if ($umkmRole) {
            $umkmUser = User::firstOrCreate(
                ['email' => 'umkm@gmail.com'],
                [
                    'name' => 'Pengelola UMKM',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $umkmUser->roles()->sync($umkmRole->id);
        }

        // 5. Buat user Pengelola Bank Foto Digital
        if ($bankFotoDigitalRole) {
            $bankFotoDigitalUser = User::firstOrCreate(
                ['email' => 'bankfotodigital@gmail.com'],
                [
                    'name' => 'Pengelola Bank Foto Digital',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $bankFotoDigitalUser->roles()->sync($bankFotoDigitalRole->id);
        }

        // 6. Buat user terdaftar biasa
        if ($userRole) {
            $regularUser = User::firstOrCreate(
                ['email' => 'user@example.com'],
                [
                    'name' => 'User Terdaftar',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $regularUser->roles()->sync($userRole->id);
        }
    }
}
