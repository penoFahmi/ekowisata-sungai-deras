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
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            // Kolom relasi ke tabel categories
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Nama UMKM atau produk
            $table->text('description'); // Deskripsi produk
            $table->string('owner_name'); // Nama pemilik
            $table->string('phone_number')->nullable(); // Kontak (opsional)
            $table->text('address')->nullable(); // Alamat (opsional)
            $table->decimal('latitude', 10, 8); // Wajib untuk SIG
            $table->decimal('longitude', 11, 8); // Wajib untuk SIG
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkms');
    }
};
