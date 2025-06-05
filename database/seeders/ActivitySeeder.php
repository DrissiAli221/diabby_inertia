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
        // Get the first user or create one
        $user = User::first() ?? User::factory()->create([
            'name' => 'Jean Dupont',
            'email' => 'jean@example.com',
        ]);

        // Create realistic activities for the past 30 days
        $this->createRealisticActivities($user);
    }

    /**
     * Create realistic activities for a user
     */
    private function createRealisticActivities(User $user): void
    {
        $now = Carbon::now();
        
        // Create activities for the past 30 days
        for ($day = 30; $day >= 0; $day--) {
            $date = $now->copy()->subDays($day);
            
            // Skip some days randomly (rest days)
            if (rand(1, 10) <= 3) {
                continue;
            }
            
            // Morning activity (60% chance)
            if (rand(1, 10) <= 6) {
                $this->createMorningActivity($user, $date);
            }
            
            // Evening activity (40% chance)
            if (rand(1, 10) <= 4) {
                $this->createEveningActivity($user, $date);
            }
        }
        
        // Create some activities for today
        $this->createTodayActivities($user);
    }

    /**
     * Create morning activity
     */
    private function createMorningActivity(User $user, Carbon $date): void
    {
        $activities = ['walking', 'running', 'cycling', 'yoga'];
        $activityType = $activities[array_rand($activities)];
        
        $duration = match($activityType) {
            'walking' => rand(20, 45),
            'running' => rand(20, 60),
            'cycling' => rand(30, 90),
            'yoga' => rand(30, 60),
            default => rand(20, 45)
        };
        
        $intensity = match($activityType) {
            'walking' => ['low', 'moderate'][array_rand(['low', 'moderate'])],
            'running' => ['moderate', 'high'][array_rand(['moderate', 'high'])],
            'cycling' => ['low', 'moderate', 'high'][array_rand(['low', 'moderate', 'high'])],
            'yoga' => 'low',
            default => 'moderate'
        };
        
        Activity::create([
            'user_id' => $user->id,
            'activity_type' => $activityType,
            'duration_minutes' => $duration,
            'intensity' => $intensity,
            'burned_calories' => $this->calculateBurnedCalories($activityType, $duration, $intensity),
            'activity_date' => $date->copy()->setTime(rand(6, 9), rand(0, 59)),
        ]);
    }

    /**
     * Create evening activity
     */
    private function createEveningActivity(User $user, Carbon $date): void
    {
        $activities = ['strength_training', 'gym', 'swimming', 'dancing', 'tennis'];
        $activityType = $activities[array_rand($activities)];
        
        $duration = match($activityType) {
            'strength_training' => rand(20, 45),
            'gym' => rand(45, 90),
            'swimming' => rand(30, 60),
            'dancing' => rand(30, 90),
            'tennis' => rand(45, 90),
            default => rand(30, 60)
        };
        
        $intensity = match($activityType) {
            'strength_training' => ['moderate', 'high'][array_rand(['moderate', 'high'])],
            'gym' => ['moderate', 'high'][array_rand(['moderate', 'high'])],
            'swimming' => ['low', 'moderate', 'high'][array_rand(['low', 'moderate', 'high'])],
            'dancing' => ['moderate', 'high'][array_rand(['moderate', 'high'])],
            'tennis' => ['moderate', 'high'][array_rand(['moderate', 'high'])],
            default => 'moderate'
        };
        
        Activity::create([
            'user_id' => $user->id,
            'activity_type' => $activityType,
            'duration_minutes' => $duration,
            'intensity' => $intensity,
            'burned_calories' => $this->calculateBurnedCalories($activityType, $duration, $intensity),
            'activity_date' => $date->copy()->setTime(rand(17, 21), rand(0, 59)),
        ]);
    }

    /**
     * Create activities for today
     */
    private function createTodayActivities(User $user): void
    {
        $today = Carbon::today();
        
        // Morning walk
        Activity::create([
            'user_id' => $user->id,
            'activity_type' => 'walking',
            'duration_minutes' => 30,
            'intensity' => 'moderate',
            'burned_calories' => $this->calculateBurnedCalories('walking', 30, 'moderate'),
            'activity_date' => $today->copy()->setTime(9, 30),
        ]);
        
        // Afternoon cycling
        Activity::create([
            'user_id' => $user->id,
            'activity_type' => 'cycling',
            'duration_minutes' => 25,
            'intensity' => 'high',
            'burned_calories' => $this->calculateBurnedCalories('cycling', 25, 'high'),
            'activity_date' => $today->copy()->setTime(18, 15),
        ]);
        
        // Evening strength training
        Activity::create([
            'user_id' => $user->id,
            'activity_type' => 'strength_training',
            'duration_minutes' => 20,
            'intensity' => 'moderate',
            'burned_calories' => $this->calculateBurnedCalories('strength_training', 20, 'moderate'),
            'activity_date' => $today->copy()->setTime(2, 0),
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