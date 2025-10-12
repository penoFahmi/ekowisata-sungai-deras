<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  // Mengizinkan satu atau lebih role
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            return redirect('login');
        }

        $user = Auth::user();

        // Loop melalui setiap role yang diizinkan
        foreach ($roles as $role) {
            // Gunakan method hasRole() dari model User Anda
            if ($user->hasRole($role)) {
                // Jika user memiliki role yang cocok, izinkan akses
                return $next($request);
            }
        }

        // Jika tidak ada role yang cocok, tolak akses
        abort(403, 'UNAUTHORIZED ACTION.');
    }
}
