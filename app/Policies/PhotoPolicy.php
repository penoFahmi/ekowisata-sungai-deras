<?php

namespace App\Policies;

use App\Models\Photo;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PhotoPolicy
{
    use HandlesAuthorization;

    /**
     * Otorisasi untuk admin bisa melakukan apa saja.
     */
    public function before(User $user, $ability)
    {
        if ($user->is_admin) {
            return true;
        }
    }

    /**
     * Tentukan apakah user dapat memperbarui foto.
     */
    public function update(User $user, Photo $photo): bool
    {
        return $user->id === $photo->user_id;
    }

    /**
     * Tentukan apakah user dapat menghapus foto.
     */
    public function delete(User $user, Photo $photo): bool
    {
        return $user->id === $photo->user_id;
    }
}
