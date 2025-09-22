<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Gallery extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    /**
     * Relasi polimorfik balik ke pemiliknya (bisa TourismSpot atau Umkm).
     */
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}
