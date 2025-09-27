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
        $umkm = Umkm::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard/umkm', [
            'umkm' => $umkm,
            'categories' => Category::all(),
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
            'address' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'main_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('main_image')) {
            $validated['main_image'] = $request->file('main_image')->store('umkm-images', 'public');
        }

        Umkm::create($validated);

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
            'address' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Handle file upload
        if ($request->hasFile('main_image')) {
            // Delete old image if it exists
            if ($umkm->main_image) {
                Storage::disk('public')->delete($umkm->main_image);
            }
            // Store new image
            $validated['main_image'] = $request->file('main_image')->store('umkm-images', 'public');
        }

        $umkm->update($validated);

        return redirect()->route('umkm.index')->with('success', 'Data UMKM berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Umkm $umkm)
    {
        // Delete the associated image from storage
        if ($umkm->main_image) {
            Storage::disk('public')->delete($umkm->main_image);
        }

        $umkm->delete();

        return redirect()->route('umkm.index')->with('success', 'Data UMKM berhasil dihapus.');
    }
}
