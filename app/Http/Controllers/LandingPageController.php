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
            ->take(3)
            ->get();

        // Ambil 3 agenda mendatang
        $agendas = Agenda::where('start_time', '>=', now())
            ->orderBy('start_time', 'asc')
            ->take(3)
            ->get();

        return Inertia::render('App', compact('tourismSpots', 'umkms', 'agendas'));
    }
}
