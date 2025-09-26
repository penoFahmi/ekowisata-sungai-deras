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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/dashboard');
    })->name('dashboard');
    Route::get('kategori', function () {
        return Inertia::render('dashboard/kategori');
    })->name('kategori');
    Route::get('wisata', function () {
        return Inertia::render('dashboard/wisata');
    })->name('wisata');

    // Route::resource('dashboard', DashboardController::class)->names('dashboard');
    Route::resource('users', UserController::class)->names('users');
    Route::resource('kategori', CategoryController::class)->names('kategori');
    Route::resource('wisata', WisataController::class)->names('wisata');
    Route::resource('umkm', UmkmController::class)->names('umkm');
    Route::resource('agenda', AgendaController::class)->names('agenda');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
