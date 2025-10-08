<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Photo;
use App\Models\User;
use App\Policies\UserPolicy;
use App\Policies\PhotoPolicy;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Photo::class => PhotoPolicy::class,
    ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
