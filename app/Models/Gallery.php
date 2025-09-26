<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Gallery extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'path',
        'type',
        'imageable_id',
        'imageable_type',
    ];

    /**
     * Relasi polimorfik balik ke pemiliknya (bisa TourismSpot atau Umkm).
     */
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}
