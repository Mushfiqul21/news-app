<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(6),
            'excerpt' => fake()->sentence(15),
            'body' => implode("\n\n", fake()->paragraphs(4)),
            'status' => fake()->randomElement([
                Post::STATUS_DRAFT,
                Post::STATUS_PUBLISHED,
            ]),
        ];
    }
}
