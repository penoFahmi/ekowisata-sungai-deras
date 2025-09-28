<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UmkmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $umkms = Umkm::with('category', 'galleries')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard/umkm', [
            'umkms' => $umkms,
            'categories' => Category::where('type', 'umkm')->get(),
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:umkms,name',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'owner_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $umkm = Umkm::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('umkm-images', 'public');
                $umkm->galleries()->create(['path' => $path]);
            }
        }

        return redirect()->route('umkm.index')->with('success', 'Data UMKM berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Umkm $umkm)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('umkms')->ignore($umkm->id)],
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'owner_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $umkm->update($validated);

        if ($request->hasFile('images')) {
            // Hapus gambar lama
            foreach ($umkm->galleries as $gallery) {
                Storage::disk('public')->delete($gallery->path);
                $gallery->delete();
            }
            // Unggah gambar baru
            foreach ($request->file('images') as $image) {
                $path = $image->store('umkm-images', 'public');
                $umkm->galleries()->create(['path' => $path]);
            }
        }

        return redirect()->route('umkm.index')->with('success', 'Data UMKM berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Umkm $umkm)
    {
        // Hapus semua gambar terkait dari storage
        foreach ($umkm->galleries as $gallery) {
            Storage::disk('public')->delete($gallery->path);
        }

        $umkm->delete();

        return redirect()->route('umkm.index')->with('success', 'Data UMKM berhasil dihapus.');
    }
}
