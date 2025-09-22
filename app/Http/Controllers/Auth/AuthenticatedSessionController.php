<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $user = $request->validateCredentials();

        if (Features::enabled(Features::twoFactorAuthentication()) && $user->hasEnabledTwoFactorAuthentication()) {
            $request->session()->put([
                'login.id' => $user->getKey(),
                'login.remember' => $request->boolean('remember'),
            ]);

            return to_route('two-factor.login');
        }

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        // return redirect()->intended(route('dashboard', absolute: false));

        $loggedInUser = $request->user();
        // Cek perannya dan arahkan ke halaman yang sesuai
        if ($loggedInUser->hasRole('administrator') || $loggedInUser->hasRole('pengelola-wisata') || $loggedInUser->hasRole('pengelola-umkm') || $loggedInUser->hasRole('pengelola-sig')) {
            // Jika dia adalah salah satu dari peran admin, arahkan ke dashboard admin
            return redirect()->intended(route('dashboard'));
        }

        // Jika tidak, berarti dia adalah 'user-terdaftar'
        return redirect()->intended(route('home'));
        // --- SELESAI PERBAIKAN ---
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
