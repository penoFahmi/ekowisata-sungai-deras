<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Menampilkan daftar semua kategori.
     */
    public function index()
    {
        return Inertia::render('dashboard/kategori', [
            'categories' => Category::latest()->paginate(10),
        ]);
    }

    /**
     * Menampilkan form untuk membuat kategori baru.
     */
    public function create()
    {
        return Inertia::render('dashboard/kategori/create');
    }

    /**
     * Menyimpan kategori baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'type' => ['required', Rule::in(['wisata', 'umkm'])],
        ]);

        Category::create($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit kategori.
     */
    public function edit(Category $category)
    {
        return Inertia::render('dashboard/kategori/edit', [
            'category' => $category,
        ]);
    }

    /**
     * Memperbarui data kategori di database.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('categories', 'name')->ignore($category->id)
            ],
            'type' => ['required', Rule::in(['wisata', 'umkm'])],
        ]);

        $category->update($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Menghapus kategori dari database.
     */
    public function destroy(Category $category)
    {
        // Jika ingin mencegah penghapusan kategori yang masih digunakan, tambahkan pengecekan di sini

        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
