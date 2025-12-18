<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FavoritePaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_returns_pagination_meta(): void
    {
        $user = User::factory()->create();
        Favorite::factory()->count(12)->for($user)->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/api/favorites?per_page=5&page=2');

        $response
            ->assertOk()
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonPath('meta.total', 12)
            ->assertJsonPath('meta.last_page', 3)
            ->assertJsonPath('meta.from', 6)
            ->assertJsonPath('meta.to', 10)
            ->assertJsonCount(5, 'data');
    }

    public function test_inertia_view_receives_paginated_payload(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        Favorite::factory()->count(8)->for($user)->create();

        $response = $this
            ->actingAs($user)
            ->get('/favorites?page=2&per_page=3');

        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Favorites/Index')
            ->where('favorites.meta.current_page', 2)
            ->where('favorites.meta.per_page', 3)
            ->where('favorites.meta.total', 8)
            ->has('favorites.data', 3));
    }
}
