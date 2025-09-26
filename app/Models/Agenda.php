<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'location',
        'poster_image_path',
    ];

    // Untuk saat ini belum ada relasi,
    // tapi bisa ditambahkan nanti jika agenda ingin dihubungkan ke lokasi wisata.
}
