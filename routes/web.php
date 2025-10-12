<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AgendaController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\TourismSpotController;
use App\Http\Controllers\Admin\UmkmController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\BankFotoController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Pest\Plugins\Profile;

Route::get('/', [LandingPageController::class, 'index'])->name('home');
Route::get('wisata-list', [LandingPageController::class, 'tourismIndex'])->name('wisata-list.index');
Route::get('wisata-list/{tourismSpot}', [LandingPageController::class, 'tourismShow'])->name('wisata-list.show');
Route::get('umkm-list', [LandingPageController::class, 'umkmIndex'])->name('umkm-list.index');
Route::get('umkm-list/{umkm}', [LandingPageController::class, 'umkmShow'])->name('umkm-list.show');
Route::get('agenda-list', [LandingPageController::class, 'agendaIndex'])->name('agenda-list.index');
Route::get('agenda-list/{agenda}', [LandingPageController::class, 'agendaShow'])->name('agenda-list.show');
Route::get('bank-foto', [BankFotoController::class, 'index'])->name('bank-foto.index');
Route::get('bank-foto/{photo}/download', [BankFotoController::class, 'download'])->name('bank-foto.download');
Route::get('bank-foto/{photo}', [BankFotoController::class, 'show'])->name('bank-foto.show');

// Rute sementara untuk membuat storage link di hosting
Route::get('/storage-link', function () {
    $targetFolder = storage_path('app/public');
    $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/storage';
    symlink($targetFolder, $linkFolder);
    return 'Symbolic link has been created.';
});

Route::middleware([
    'auth',
    'verified',
    'role:administrator,pengelola-wisata,pengelola-umkm,pengelola-bank-foto-digital'
    ])->group(function () {

    // Route::get('profile', [ProfileController::class, 'profile'])->name('profile');
    // Route::post('bank-foto', [BankFotoController::class, 'store'])->name('bank-foto.store');
    // Route::post('bank-foto/{photo}/like', [BankFotoController::class, 'like'])->name('bank-foto.like');
    // Route::put('bank-foto/{photo}', [BankFotoController::class, 'update'])->name('bank-foto.update');
    // Route::delete('bank-foto/{photo}', [BankFotoController::class, 'destroy'])->name('bank-foto.destroy');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
    Route::resource('kategori', CategoryController::class)->except(['create', 'edit', 'show']);
    Route::resource('wisata', TourismSpotController::class)->except(['create', 'edit', 'show']);
    Route::resource('umkm', UmkmController::class)->except(['create', 'edit', 'show']);
    Route::resource('agenda', AgendaController::class)->except(['create', 'edit', 'show']);
    Route::get('setting', function () {
        return Inertia::render('dashboard/setting');
    })->name('setting');

});

Route::middleware([
    'auth',
    'verified',
    ])->group(function () {

    Route::get('profile', [ProfileController::class, 'profile'])->name('profile');
    Route::post('bank-foto', [BankFotoController::class, 'store'])->name('bank-foto.store');
    Route::post('bank-foto/{photo}/like', [BankFotoController::class, 'like'])->name('bank-foto.like');
    Route::put('bank-foto/{photo}', [BankFotoController::class, 'update'])->name('bank-foto.update');
    Route::delete('bank-foto/{photo}', [BankFotoController::class, 'destroy'])->name('bank-foto.destroy');

    // Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
    // Route::resource('kategori', CategoryController::class)->except(['create', 'edit', 'show']);
    // Route::resource('wisata', TourismSpotController::class)->except(['create', 'edit', 'show']);
    // Route::resource('umkm', UmkmController::class)->except(['create', 'edit', 'show']);
    // Route::resource('agenda', AgendaController::class)->except(['create', 'edit', 'show']);
    // Route::get('setting', function () {
    //     return Inertia::render('dashboard/setting');
    // })->name('setting');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
