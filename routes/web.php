<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AgendaController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\TourismSpotController;
use App\Http\Controllers\Admin\UmkmController;
use App\Http\Controllers\LandingPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingPageController::class, 'index'])->name('home');

// Rute sementara untuk membuat storage link di hosting
Route::get('/storage-link', function () {
    $targetFolder = storage_path('app/public');
    $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/storage';
    symlink($targetFolder, $linkFolder);
    return 'Symbolic link has been created.';
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/dashboard');
    })->name('dashboard');
    Route::get('setting', function () {
        return Inertia::render('dashboard/setting');
    })->name('setting');

    Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
    Route::resource('kategori', CategoryController::class)->except(['create', 'edit', 'show']);
    Route::resource('wisata', TourismSpotController::class)->except(['create', 'edit', 'show']);
    Route::resource('umkm', UmkmController::class)->except(['create', 'edit', 'show']);
    Route::resource('agenda', AgendaController::class)->except(['create', 'edit', 'show']);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
