<?php

namespace App\Policies;

use App\Models\Favorite;
use App\Models\User;

class FavoritePolicy
{
    /**
     * Determine whether the user can view any favorites.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the favorite.
     */
    public function view(User $user, Favorite $favorite): bool
    {
        return $user->id === $favorite->user_id;
    }

    /**
     * Determine whether the user can create favorites.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the favorite.
     */
    public function update(User $user, Favorite $favorite): bool
    {
        return $this->view($user, $favorite);
    }

    /**
     * Determine whether the user can delete the favorite.
     */
    public function delete(User $user, Favorite $favorite): bool
    {
        return $this->view($user, $favorite);
    }
}
