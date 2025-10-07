<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BankFotoController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only('search', 'category', 'tags', 'sort');

        $photos = Photo::query()
            ->with(['user', 'tags'])
            ->when(Auth::check(), function ($query) {
                $query->withExists(['likers as is_liked' => fn ($q) => $q->where('user_id', Auth::id())]);
            })
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->input('category') && $request->input('category') !== 'all', function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->input('tags'), function ($query, $tags) {
                $query->whereHas('tags', function ($q) use ($tags) {
                    $q->whereIn('slug', $tags);
                });
            })
            ->when($request->input('sort'), function ($query, $sort) {
                if ($sort === 'popular') {
                    return $query->orderBy('views', 'desc');
                }
                if ($sort === 'downloads') {
                    return $query->orderBy('downloads', 'desc');
                }
                if ($sort === 'likes') {
                    return $query->orderBy('likes', 'desc');
                }
                // Default to newest
                return $query->latest();
            }, function ($query) {
                // Default sort if not provided
                return $query->latest();
            })
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'totalPhotos' => Photo::count(),
            'totalUsers' => User::has('photos')->count(),
            'totalDownloads' => Photo::sum('downloads'),
            'totalLikes' => Photo::sum('likes'),
            'countKerajinan' => Photo::where('category', 'kerajinan')->count(),
            'countWisata' => Photo::where('category', 'wisata')->count(),
        ];

        // Ambil 15 tag paling populer berdasarkan jumlah foto
        $availableTags = Tag::withCount('photos')
            ->orderBy('photos_count', 'desc')
            ->take(15)
            ->get();

        return Inertia::render('bank-foto-digital', [
            'photos' => $photos,
            'stats' => $stats,
            'availableTags' => $availableTags,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:kerajinan,wisata',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50', // Bisa berupa ID atau nama tag baru
        ]);

        $imagePath = $request->file('image')->store('photos', 'public');

        $photo = Auth::user()->photos()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'image_path' => $imagePath,
        ]);

        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                // Cek apakah tag sudah ada atau buat baru
                $tag = Tag::firstOrCreate(
                    ['slug' => Str::slug($tagName)],
                    ['name' => $tagName]
                );
                $tagIds[] = $tag->id;
            }
            // Sinkronkan foto dengan tag
            $photo->tags()->sync($tagIds);
        }

        return redirect()->route('bank-foto')->with('success', 'Foto berhasil diunggah!');
    }

    public function like(Photo $photo)
    {
        $user = Auth::user();
        $hasLiked = $user->likedPhotos()->where('photo_id', $photo->id)->count();

        if ($hasLiked) {
            $user->likedPhotos()->detach($photo->id);
            $photo->likes--;
        } else {
            $user->likedPhotos()->attach($photo->id);
            $photo->increment('likes');
        }

        return back();
    }

    public function download(Photo $photo)
    {
        $photo->increment('downloads');

        return Storage::disk('public')->download($photo->image_path);
    }

    public function update(Request $request, Photo $photo)
    {
        Gate::authorize('update', $photo);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:kerajinan,wisata',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $photo->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
        ]);

        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(
                    ['slug' => Str::slug($tagName)],
                    ['name' => $tagName]
                );
                $tagIds[] = $tag->id;
            }
            $photo->tags()->sync($tagIds);
        } else {
            $photo->tags()->sync([]);
        }

        return back()->with('success', 'Detail foto berhasil diperbarui.');
    }

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

    public function destroy(Photo $photo)
    {
        Gate::authorize('delete', $photo);

        // Hapus file dari storage
        Storage::disk('public')->delete($photo->image_path);

        $photo->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }
}
