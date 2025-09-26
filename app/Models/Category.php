<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'type',
    ];

    /**
     * Satu kategori bisa memiliki banyak tempat wisata.
     */
    public function tourismSpots(): HasMany
    {
        return $this->hasMany(TourismSpot::class);
    }

    /**
     * Satu kategori bisa memiliki banyak UMKM.
     */
    public function umkms(): HasMany
    {
        return $this->hasMany(Umkm::class);
    }
}
