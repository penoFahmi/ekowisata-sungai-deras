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

    Route::prefix('admin')->name('admin.')->group(function () {
        // Ini adalah baris kuncinya.
        // Route::resource akan otomatis membuat semua route yang dibutuhkan:
        // GET /admin/users -> UserController@index (admin.users.index)
        // GET /admin/users/create -> UserController@create (admin.users.create)
        // POST /admin/users -> UserController@store (admin.users.store)
        // GET /admin/users/{user} -> UserController@show (admin.users.show)
        // GET /admin/users/{user}/edit -> UserController@edit (admin.users.edit)
        // PUT/PATCH /admin/users/{user} -> UserController@update (admin.users.update)
        // DELETE /admin/users/{user} -> UserController@destroy (admin.users.destroy)
        Route::resource('users', UserController::class);

    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
