<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AgendaController extends Controller
{
    /**
     * Menampilkan daftar semua agenda.
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
            'agendas' => $agendas,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Menyimpan agenda baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'location' => 'required|string|max:255',
            'poster_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('poster_image')) {
            $validated['poster_image_path'] = $request->file('poster_image')->store('agenda-posters', 'public');
        }

        Agenda::create($validated);

        return redirect()->route('agenda.index')->with('success', 'Agenda berhasil ditambahkan.');
    }

    /**
     * Memperbarui agenda yang ada.
     */
    public function update(Request $request, Agenda $agenda)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'location' => 'required|string|max:255',
            'poster_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('poster_image')) {
            if ($agenda->poster_image_path) {
                Storage::disk('public')->delete($agenda->poster_image_path);
            }
            $validated['poster_image_path'] = $request->file('poster_image')->store('agenda-posters', 'public');
        }

        $agenda->update($validated);

        return redirect()->route('agenda.index')->with('success', 'Agenda berhasil diperbarui.');
    }

    /**
     * Menghapus agenda.
     */
    public function destroy(Agenda $agenda)
    {
        if ($agenda->poster_image_path) {
            Storage::disk('public')->delete($agenda->poster_image_path);
        }
        $agenda->delete();

        return redirect()->route('agenda.index')->with('success', 'Agenda berhasil dihapus.');
    }
}
