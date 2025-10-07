<?php

namespace App\Http\Controllers;

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
        $tourismSpots = TourismSpot::with(['category', 'galleries'])
            ->latest()
            ->paginate(9) // Menampilkan 9 item per halaman
            ->withQueryString();

        return Inertia::render('wisata-list/wisata', [
            'tourismSpots' => $tourismSpots,
        ]);
    }

    public function tourismShow(TourismSpot $tourismSpot)
    {
        $tourismSpot->load(['category', 'galleries']);

        return Inertia::render('wisata-list/wisata-detail', [
            'tourismSpot' => $tourismSpot,
        ]);
    }
}
