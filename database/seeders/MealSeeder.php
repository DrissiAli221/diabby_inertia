<?php

namespace Database\Seeders;

use App\Models\Meal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MealSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate([
            'email' => 'drissiali2004@gmail.com',
        ], [
            'name' => 'Ali Drissi',
            'password' => bcrypt('password123'), // Use a safe password
        ]);

        $this->createMealsForUser($user);
    }

    /**
     * Create realistic meals for a user for today
     */
    private function createMealsForUser(User $user): void
    {
        $today = Carbon::now()->startOfDay();

        // Create breakfast
        $breakfast = Meal::factory()->breakfast()->create([
            'user_id' => $user->id,
            'eaten_at' => $today->copy()->setTime(8, 30, 0),
        ]);

        $breakfast->mealItems()->create([
            'name' => 'Pain complet',
            'calories' => 160,
            'carbs' => 32,
            'fat' => 1,
            'protein' => 6,
            'portion_description' => '2 tranches (60g)',
        ]);

        $breakfast->mealItems()->create([
            'name' => 'Œuf brouillé',
            'calories' => 90,
            'carbs' => 1,
            'fat' => 7,
            'protein' => 6,
            'portion_description' => '1 œuf (50g)',
        ]);

        $breakfast->updateTotals();

        // Create lunch
        $lunch = Meal::factory()->lunch()->create([
            'user_id' => $user->id,
            'eaten_at' => $today->copy()->setTime(12, 15, 0),
        ]);

        $lunch->mealItems()->create([
            'name' => 'Salade mixte',
            'calories' => 45,
            'carbs' => 9,
            'fat' => 0.5,
            'protein' => 2.5,
            'portion_description' => 'Portion (100g)',
        ]);

        $lunch->mealItems()->create([
            'name' => 'Filet de saumon',
            'calories' => 240,
            'carbs' => 0,
            'fat' => 15,
            'protein' => 25,
            'portion_description' => '150g',
        ]);

        $lunch->updateTotals();

        // Create dinner
        $dinner = Meal::factory()->dinner()->create([
            'user_id' => $user->id,
            'eaten_at' => $today->copy()->setTime(19, 45, 0),
        ]);

        $dinner->mealItems()->create([
            'name' => 'Soupe de légumes',
            'calories' => 120,
            'carbs' => 18,
            'fat' => 3.5,
            'protein' => 6,
            'portion_description' => 'Bol (250ml)',
        ]);

        $dinner->mealItems()->create([
            'name' => 'Fromage blanc',
            'calories' => 80,
            'carbs' => 4,
            'fat' => 0.5,
            'protein' => 15,
            'portion_description' => '100g',
        ]);

        $dinner->updateTotals();
    }
}