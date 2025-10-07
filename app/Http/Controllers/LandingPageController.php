<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Agenda;
use App\Models\TourismSpot;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    /**
     * Menampilkan data untuk landing page.
     */
    public function index()
    {
        // Ambil 4 data wisata terbaru dengan relasi galeri
        $tourismSpots = TourismSpot::with('galleries', 'category')
            ->latest()
            ->take(3)
            ->get();

        // Ambil 4 data UMKM terbaru dengan relasi galeri
        $umkms = Umkm::with('galleries', 'category')
            ->latest()
            ->take(6)
            ->get();

        // Ambil 3 agenda mendatang
        $agendas = Agenda::where('start_time', '>=', now())
            ->orderBy('start_time', 'asc')
            ->take(3)
            ->get();

        return Inertia::render('App', compact('tourismSpots', 'umkms', 'agendas'));
    }

    public function tourismIndex(Request $request)
    {
        $filters = $request->only('search');

        $tourismSpots = TourismSpot::with(['category', 'galleries'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(9) // Menampilkan 9 item per halaman
            ->withQueryString();

        return Inertia::render('wisata-list/wisata', [
            'tourismSpots' => $tourismSpots,
            'filters' => $filters,
        ]);
    }

    public function tourismShow(TourismSpot $tourismSpot)
    {
        $tourismSpot->load(['category', 'galleries']);

        return Inertia::render('wisata-list/wisata-detail', [
            'tourismSpot' => $tourismSpot,
        ]);
    }

    public function umkmIndex(Request $request)
    {
        $filters = $request->only('search', 'category');

        $umkms = Umkm::with(['category', 'galleries'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->input('category'), function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('wisata-list/umkm', [
            'umkms' => $umkms,
            'categories' => Category::where('type', 'umkm')->get(),
            'filters' => $filters,
        ]);
    }

    public function umkmShow(Umkm $umkm)
    {
        $umkm->load(['category', 'galleries']);

        return Inertia::render('wisata-list/umkm-detail', [
            'umkm' => $umkm,
        ]);
    }

    public function agendaIndex(Request $request)
    {
        $filters = $request->only('search');

        $agendas = Agenda::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest('start_time') // Mengurutkan berdasarkan waktu mulai, yang terbaru/terdekat akan muncul duluan
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('wisata-list/agenda', [
            'agendas' => $agendas,
            'filters' => $filters,
        ]);
    }

    public function agendaShow(Agenda $agenda)
    {
        return Inertia::render('wisata-list/agenda-detail', [
            'agenda' => $agenda,
        ]);
    }
}
