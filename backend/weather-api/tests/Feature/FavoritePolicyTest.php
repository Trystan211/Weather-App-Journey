<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoritePolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_update_another_users_favorite(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $favorite = Favorite::factory()->for($owner)->create([
            'title' => 'Original title',
        ]);

        $response = $this
            ->actingAs($other)
            ->patchJson("/api/favorites/{$favorite->id}", [
                'title' => 'Hacked title',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseHas('favorites', [
            'id' => $favorite->id,
            'title' => 'Original title',
        ]);
    }

    public function test_user_cannot_delete_another_users_favorite(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $favorite = Favorite::factory()->for($owner)->create();

        $response = $this
            ->actingAs($other)
            ->deleteJson("/api/favorites/{$favorite->id}");

        $response->assertForbidden();

        $this->assertDatabaseHas('favorites', [
            'id' => $favorite->id,
        ]);
    }
}
