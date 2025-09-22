<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    // Untuk saat ini belum ada relasi,
    // tapi bisa ditambahkan nanti jika agenda ingin dihubungkan ke lokasi wisata.
}
