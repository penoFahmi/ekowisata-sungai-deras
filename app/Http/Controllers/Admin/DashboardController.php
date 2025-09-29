<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\TourismSpot;
use App\Models\Umkm;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_wisata' => TourismSpot::count(),
            'total_umkm' => Umkm::count(),
            'total_agenda' => Agenda::count(),
            'total_users' => User::count(),
        ];

        $recent_activities = [
            'latest_wisata' => TourismSpot::with('category', 'galleries')->latest()->take(5)->get(),
            'latest_umkm' => Umkm::with('category', 'galleries')->latest()->take(5)->get(),
        ];

        return Inertia::render('dashboard/dashboard', [
            'stats' => $stats,
            'recent_activities' => $recent_activities,
        ]);
    }
}
