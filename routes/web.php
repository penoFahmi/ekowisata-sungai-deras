<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;

Route::get('/', function () {
    return Inertia::render('App');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/dashboard');
    })->name('dashboard');
    Route::get('user', function () {
        return Inertia::render('dashboard/components/user');
    })->name('user');
    Route::get('kategori', function () {
        return Inertia::render('dashboard/components/kategori');
    })->name('kategori');
    Route::get('wisata', function () {
        return Inertia::render('dashboard/components/wisata');
    })->name('wisata');
    Route::get('umkm', function () {
        return Inertia::render('dashboard/components/umkm');
    })->name('umkm');
    Route::get('agenda', function () {
        return Inertia::render('dashboard/components/agenda');
    })->name('agenda');
    Route::get('setting', function () {
        return Inertia::render('dashboard/components/setting');
    })->name('setting');

    // === HALAMAN ADMIN ===
    Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:administrator'])->group(function () {

        // Ini akan membuat route seperti:
        // admin.users.index -> GET /admin/users
        // admin.users.create -> GET /admin/users/create
        // admin.users.store -> POST /admin/users
        // admin.users.edit -> GET /admin/users/{user}/edit
        // ...dan seterusnya
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);

        // ... route admin lainnya nanti di sini
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
