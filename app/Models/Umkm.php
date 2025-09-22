<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Umkm extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    /**
     * Satu UMKM dimiliki oleh satu kategori.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Satu UMKM bisa memiliki banyak item di galeri (polimorfik).
     */
    public function galleries(): MorphMany
    {
        return $this->morphMany(Gallery::class, 'imageable');
    }
}
