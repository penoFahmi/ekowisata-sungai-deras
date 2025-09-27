<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\AgendaController;
use App\Http\Controllers\Admin\TourismSpotController;
use App\Http\Controllers\Admin\UmkmController;
use App\Http\Controllers\Admin\WisataController;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/', function () {
    return Inertia::render('App');
})->name('home');

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
