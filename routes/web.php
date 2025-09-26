<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\AgendaController;
use App\Http\Controllers\Admin\UmkmController;
use App\Http\Controllers\Admin\WisataController;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/', function () {
    return Inertia::render('App');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard/dashboard');
    // })->name('dashboard');
    // Route::get('users', function () {
    //     return Inertia::render('dashboard/user');
    // })->name('users');
    // Route::get('kategori', function () {
    //     return Inertia::render('dashboard/kategori');
    // })->name('kategori');
    // Route::get('wisata', function () {
    //     return Inertia::render('dashboard/wisata');
    // })->name('wisata');
    // Route::get('umkm', function () {
    //     return Inertia::render('dashboard/umkm');
    // })->name('umkm');
    // Route::get('agenda', function () {
    //     return Inertia::render('dashboard/agenda');
    // })->name('agenda');
    // Route::get('setting', function () {
    //     return Inertia::render('dashboard/setting');
    // })->name('setting');

    // GUNAKAN GRUP INI UNTUK SEMUA FITUR ADMIN
    Route::prefix('admin')
         ->name('admin.')
         // ->middleware('role:administrator') // Anda bisa aktifkan ini nanti
         ->group(function () {
             // Route ini sudah benar dan akan meng-handle semua request CRUD
             Route::resource('dashboard', DashboardController::class)->names('dashboard');
             Route::resource('users', UserController::class)->names('users');
             Route::resource('kategori', CategoryController::class)->names('kategori');
             Route::resource('wisata', WisataController::class)->names('wisata');
             Route::resource('umkm', UmkmController::class)->names('umkm');
             Route::resource('agenda', AgendaController::class)->names('agenda');
     });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
