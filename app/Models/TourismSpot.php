<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class TourismSpot extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    /**
     * Satu tempat wisata dimiliki oleh satu kategori.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Satu tempat wisata bisa memiliki banyak item di galeri (polimorfik).
     */
    public function galleries(): MorphMany
    {
        return $this->morphMany(Gallery::class, 'imageable');
    }
}
