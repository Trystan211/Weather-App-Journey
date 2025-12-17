<?php

namespace Database\Factories;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Favorite>
 */
class FavoriteFactory extends Factory
{
    protected $model = Favorite::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'api_id' => (string) fake()->numberBetween(100000, 999999),
            'title' => fake()->city(),
            'note' => fake()->optional()->sentence(),
            'meta' => ['source' => 'factory'],
        ];
    }
}
