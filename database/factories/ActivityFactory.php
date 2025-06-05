<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Activity::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $activityType = $this->faker->randomElement([
            'walking', 'running', 'cycling', 'swimming', 'strength_training',
            'yoga', 'hiking', 'dancing', 'tennis', 'football', 'basketball', 'gym'
        ]);
        
        $intensity = $this->faker->randomElement(['low', 'moderate', 'high']);
        $duration = $this->faker->numberBetween(15, 120);
        
        return [
            'user_id' => User::factory(),
            'activity_type' => $activityType,
            'duration_minutes' => $duration,
            'intensity' => $intensity,
            'burned_calories' => $this->calculateBurnedCalories($activityType, $duration, $intensity),
            'activity_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }

    /**
     * Create a walking activity.
     */
    public function walking(): static
    {
        return $this->state(function (array $attributes) {
            $duration = $this->faker->numberBetween(20, 60);
            $intensity = $this->faker->randomElement(['low', 'moderate']);
            
            return [
                'activity_type' => 'walking',
                'duration_minutes' => $duration,
                'intensity' => $intensity,
                'burned_calories' => $this->calculateBurnedCalories('walking', $duration, $intensity),
            ];
        });
    }

    /**
     * Create a running activity.
     */
    public function running(): static
    {
        return $this->state(function (array $attributes) {
            $duration = $this->faker->numberBetween(20, 90);
            $intensity = $this->faker->randomElement(['moderate', 'high']);
            
            return [
                'activity_type' => 'running',
                'duration_minutes' => $duration,
                'intensity' => $intensity,
                'burned_calories' => $this->calculateBurnedCalories('running', $duration, $intensity),
            ];
        });
    }

    /**
     * Create a cycling activity.
     */
    public function cycling(): static
    {
        return $this->state(function (array $attributes) {
            $duration = $this->faker->numberBetween(30, 120);
            $intensity = $this->faker->randomElement(['low', 'moderate', 'high']);
            
            return [
                'activity_type' => 'cycling',
                'duration_minutes' => $duration,
                'intensity' => $intensity,
                'burned_calories' => $this->calculateBurnedCalories('cycling', $duration, $intensity),
            ];
        });
    }

    /**
     * Create a strength training activity.
     */
    public function strengthTraining(): static
    {
        return $this->state(function (array $attributes) {
            $duration = $this->faker->numberBetween(20, 60);
            $intensity = $this->faker->randomElement(['moderate', 'high']);
            
            return [
                'activity_type' => 'strength_training',
                'duration_minutes' => $duration,
                'intensity' => $intensity,
                'burned_calories' => $this->calculateBurnedCalories('strength_training', $duration, $intensity),
            ];
        });
    }

    /**
     * Create activities for today.
     */
    public function today(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'activity_date' => $this->faker->dateTimeBetween('today', 'now'),
            ];
        });
    }

    /**
     * Create activities for this week.
     */
    public function thisWeek(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'activity_date' => $this->faker->dateTimeBetween('monday this week', 'now'),
            ];
        });
    }

    /**
     * Calculate burned calories based on activity parameters.
     */
    private function calculateBurnedCalories(string $activityType, int $duration, string $intensity): float
    {
        // Assuming average weight of 70kg for calculation
        $weight = 70;
        
        $metValues = [
            'walking' => ['low' => 2.5, 'moderate' => 3.5, 'high' => 4.5],
            'running' => ['low' => 6.0, 'moderate' => 8.0, 'high' => 11.0],
            'cycling' => ['low' => 4.0, 'moderate' => 6.8, 'high' => 10.0],
            'swimming' => ['low' => 4.0, 'moderate' => 6.0, 'high' => 8.0],
            'strength_training' => ['low' => 3.0, 'moderate' => 5.0, 'high' => 6.0],
            'yoga' => ['low' => 2.0, 'moderate' => 3.0, 'high' => 4.0],
            'hiking' => ['low' => 4.0, 'moderate' => 6.0, 'high' => 8.0],
            'dancing' => ['low' => 3.0, 'moderate' => 4.8, 'high' => 7.0],
            'tennis' => ['low' => 5.0, 'moderate' => 7.0, 'high' => 8.0],
            'football' => ['low' => 6.0, 'moderate' => 8.0, 'high' => 10.0],
            'basketball' => ['low' => 6.0, 'moderate' => 8.0, 'high' => 10.0],
            'gym' => ['low' => 3.0, 'moderate' => 5.0, 'high' => 6.0],
        ];
        
        $met = $metValues[$activityType][$intensity] ?? 4.0;
        
        // Calories = MET × weight (kg) × time (hours)
        return round($met * $weight * ($duration / 60), 1);
    }
}