<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{

    public function profile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $photos = $user->photos()
            ->with(['user', 'tags'])
            // Selalu true karena ini foto milik user, tapi kita jaga untuk konsistensi
            ->withExists(['likers as is_liked' => fn ($q) => $q->where('user_id', $user->id)])
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'totalPhotos' => $user->photos()->count(),
            'totalLikes' => $user->photos()->sum('likes'),
            'totalDownloads' => $user->photos()->sum('downloads'),
            'totalViews' => $user->photos()->sum('views'),
        ];

        return Inertia::render('bank-foto/profile', [
            'photos' => $photos,
            'stats' => $stats,
        ]);
    }
}
