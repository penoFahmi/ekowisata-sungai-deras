<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\TourismSpot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TourismSpotController extends Controller
{
    /**
     * Menampilkan daftar semua tempat wisata.
     */
    public function index(Request $request)
    {
        $tourismSpots = TourismSpot::with('category', 'galleries')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard/wisata', [
            'tourismSpots' => $tourismSpots,
            'categories' => Category::where('type', 'wisata')->get(),
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Menyimpan data tempat wisata baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tourism_spots,name',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'address' => 'required|string|max:255',
            // 'latitude' => 'nullable|numeric',
            // 'longitude' => 'nullable|numeric',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $tourismSpot = TourismSpot::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('tourism-spot-images', 'public');
                $tourismSpot->galleries()->create(['path' => $path]);
            }
        }

        return redirect()->route('wisata.index')->with('success', 'Tempat wisata berhasil ditambahkan.');
    }

    /**
     * Memperbarui data tempat wisata.
     */
    public function update(Request $request, TourismSpot $wisatum)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('tourism_spots')->ignore($wisatum->id)],
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'address' => 'required|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $wisatum->update($validated);

        if ($request->hasFile('images')) {
            // Hapus gambar lama
            foreach ($wisatum->galleries as $gallery) {
                Storage::disk('public')->delete($gallery->path);
                $gallery->delete();
            }
            // Unggah gambar baru
            foreach ($request->file('images') as $image) {
                $path = $image->store('tourism-spot-images', 'public');
                $wisatum->galleries()->create(['path' => $path]);
            }
        }

        return redirect()->route('wisata.index')->with('success', 'Tempat wisata berhasil diperbarui.');
    }

    /**
     * Menghapus data tempat wisata.
     */
    public function destroy(TourismSpot $wisatum)
    {
        // Hapus semua gambar terkait dari storage
        foreach ($wisatum->galleries as $gallery) {
            Storage::disk('public')->delete($gallery->path);
        }

        $wisatum->delete(); // Ini juga akan menghapus record galeri karena onDelete('cascade')

        return redirect()->route('wisata.index')->with('success', 'Tempat wisata berhasil dihapus.');
    }
}
