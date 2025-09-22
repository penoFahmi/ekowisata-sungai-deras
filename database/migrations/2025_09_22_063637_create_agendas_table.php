<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('agendas', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Judul acara
            $table->text('description'); // Deskripsi lengkap acara
            $table->dateTime('start_time'); // Waktu mulai acara
            $table->dateTime('end_time'); // Waktu selesai acara
            $table->string('location'); // Lokasi dalam bentuk teks
            $table->string('poster_image_path')->nullable(); // Path ke gambar poster (opsional)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
};
