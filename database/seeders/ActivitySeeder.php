<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Retrieve or create the user
        $user = User::firstOrCreate(
            ['email' => 'drissiali2004@gmail.com'],
            ['name' => 'Drissi Ali']
        );

        // Generate realistic activities
        $this->createRealisticActivities($user);
    }

    /**
     * Create realistic activities for a user
     */
    private function createRealisticActivities(User $user): void
    {
        $now = Carbon::now();

        // Randomly select 12 to 18 days in the past 30 days as active days
        $activeDays = collect(range(1, 30))
            ->shuffle()
            ->take(rand(12, 18))
            ->sort()
            ->values();

        foreach ($activeDays as $dayOffset) {
            $date = $now->copy()->subDays($dayOffset);

            // Randomly decide the number of activities for the day (1 or 2)
            $activityCount = rand(1, 2);

            if ($activityCount >= 1) {
                $this->createRandomActivity($user, $date->copy()->setTime(rand(6, 10), rand(0, 59)));
            }
            if ($activityCount === 2) {
                $this->createRandomActivity($user, $date->copy()->setTime(rand(17, 21), rand(0, 59)));
            }
        }

        // Optionally add an activity for today
        if (rand(0, 1)) {
            $this->createRandomActivity($user, $now->copy()->setTime(rand(7, 20), rand(0, 59)));
        }
    }

    /**
     * Create a random activity for a user at a specific datetime
     */
    private function createRandomActivity(User $user, Carbon $datetime): void
    {
        $activityPools = [
            'morning' => ['walking', 'running', 'cycling', 'yoga'],
            'evening' => ['strength_training', 'gym', 'swimming', 'dancing', 'tennis']
        ];

        $hour = $datetime->hour;
        $slot = $hour < 12 ? 'morning' : 'evening';

        $activityType = $activityPools[$slot][array_rand($activityPools[$slot])];

        $duration = match ($activityType) {
            'walking' => rand(20, 45),
            'running' => rand(20, 60),
            'cycling' => rand(30, 90),
            'yoga' => rand(30, 60),
            'strength_training' => rand(20, 45),
            'gym' => rand(45, 90),
            'swimming' => rand(30, 60),
            'dancing' => rand(30, 90),
            'tennis' => rand(45, 90),
            default => rand(30, 60),
        };

        $intensityLevels = [
            'walking' => ['low', 'moderate'],
            'running' => ['moderate', 'high'],
            'cycling' => ['low', 'moderate', 'high'],
            'yoga' => ['low'],
            'strength_training' => ['moderate', 'high'],
            'gym' => ['moderate', 'high'],
            'swimming' => ['low', 'moderate', 'high'],
            'dancing' => ['moderate', 'high'],
            'tennis' => ['moderate', 'high'],
        ];

        $intensity = $intensityLevels[$activityType][array_rand($intensityLevels[$activityType])];

        Activity::create([
            'user_id' => $user->id,
            'activity_type' => $activityType,
            'duration_minutes' => $duration,
            'intensity' => $intensity,
            'burned_calories' => $this->calculateBurnedCalories($activityType, $duration, $intensity),
            'activity_date' => $datetime,
        ]);
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