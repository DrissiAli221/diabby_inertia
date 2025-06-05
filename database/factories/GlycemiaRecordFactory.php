<?php

namespace Database\Factories;

use App\Models\GlycemiaRecord;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GlycemiaRecord>
 */
class GlycemiaRecordFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = GlycemiaRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $value = $this->faker->randomFloat(1, 3.0, 12.0);
        
        return [
            'user_id' => User::factory(),
            'value' => $value,
            'measured_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'status' => $this->determineStatus($value),
            'note' => $this->faker->optional(0.3)->sentence(),
        ];
    }

    /**
     * Create a normal reading
     */
    public function normal(): static
    {
        return $this->state(function (array $attributes) {
            $value = $this->faker->randomFloat(1, 4.0, 7.0);
            return [
                'value' => $value,
                'status' => 'normal',
            ];
        });
    }

    /**
     * Create a high reading
     */
    public function high(): static
    {
        return $this->state(function (array $attributes) {
            $value = $this->faker->randomFloat(1, 7.1, 12.0);
            return [
                'value' => $value,
                'status' => 'high',
            ];
        });
    }

    /**
     * Create a low reading
     */
    public function low(): static
    {
        return $this->state(function (array $attributes) {
            $value = $this->faker->randomFloat(1, 2.5, 3.9);
            return [
                'value' => $value,
                'status' => 'low',
            ];
        });
    }

    /**
     * Create readings for today
     */
    public function today(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'measured_at' => $this->faker->dateTimeBetween('today', 'now'),
            ];
        });
    }

    /**
     * Create readings for this week
     */
    public function thisWeek(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'measured_at' => $this->faker->dateTimeBetween('monday this week', 'now'),
            ];
        });
    }

    /**
     * Determine status based on value
     */
    private function determineStatus($value): string
    {
        if ($value < 4.0) {
            return 'low';
        } elseif ($value > 7.0) {
            return 'high';
        }
        return 'normal';
    }
}