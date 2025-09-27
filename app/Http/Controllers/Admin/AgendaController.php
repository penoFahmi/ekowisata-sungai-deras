<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $agendas = Agenda::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard/agenda', [
            'agendas' => Agenda::latest()->get(),
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:agendas,title',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'poster_image_path' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('poster_image_path')) {
            $validated['poster_image_path'] = $request->file('poster_image_path')->store('agenda-images', 'public');
        }

        Agenda::create($validated);

        return redirect()->route('agenda.index')->with('success', 'Agenda berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Agenda $agenda)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255', Rule::unique('agendas')->ignore($agenda->id)],
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'poster_image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Handle file upload
        if ($request->hasFile('poster_image_path')) {
            // Hapus gambar lama jika ada
            if ($agenda->poster_image_path) {
                Storage::disk('public')->delete($agenda->poster_image_path);
            }
            // Simpan gambar baru
            $validated['poster_image_path'] = $request->file('poster_image_path')->store('agenda-images', 'public');
        }

        $agenda->update($validated);

        return redirect()->route('agenda.index')->with('success', 'Agenda berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agenda $agenda)
    {
        // Hapus gambar terkait dari storage
        if ($agenda->poster_image_path) {
            Storage::disk('public')->delete($agenda->poster_image_path);
        }

        $agenda->delete();

        return redirect()->route('agenda.index')->with('success', 'Agenda berhasil dihapus.');
    }
}
