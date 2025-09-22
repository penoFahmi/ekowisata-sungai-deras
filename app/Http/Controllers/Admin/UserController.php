<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index()
    {
        // Ambil semua user beserta relasi roles-nya
        $users = User::with('roles')->latest()->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all(), // Kirim semua role ke form
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles' => 'required|array' // Pastikan roles dikirim sebagai array
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Pasang role yang dipilih ke user baru
        $user->roles()->sync($request->roles);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil dibuat.');
    }

    /**
     * Menampilkan detail satu user (opsional, jarang dipakai di dashboard).
     */
    public function show(User $user)
    {
        // Load relasi roles untuk ditampilkan
        $user->load('roles');
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Menampilkan form untuk mengedit user.
     */
    public function edit(User $user)
    {
        // Load relasi roles agar bisa ditampilkan di form edit
        $user->load('roles');
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => Role::all(), // Kirim semua role untuk pilihan
        ]);
    }

    /**
     * Memperbarui data user di database.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            // Pastikan email unik, tapi abaikan email user saat ini
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            // Password bersifat opsional, hanya divalidasi jika diisi
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'roles' => 'required|array'
        ]);

        // Update data user
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Jika ada password baru yang diinput, update passwordnya
        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        // Sinkronisasi ulang roles-nya
        $user->roles()->sync($request->roles);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Menghapus user dari database.
     */
    // public function destroy(User $user)
    // {
    //     // Tambahkan logika untuk mencegah user menghapus dirinya sendiri
    //     if (auth()->id() === $user->id) {
    //         return redirect()->route('admin.users.index')->with('error', 'Anda tidak bisa menghapus akun Anda sendiri.');
    //     }

    //     $user->delete();

    //     return redirect()->route('admin.users.index')->with('success', 'User berhasil dihapus.');
    // }
}
