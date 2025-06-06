<?php

namespace Database\Seeders;

use App\Models\Meal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class YesterdayMealSeeder extends Seeder
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
     * Create realistic meals for a user for yesterday
     */
    private function createMealsForUser(User $user): void
    {
        $yesterday = Carbon::now()->subDay()->startOfDay();

        // Create breakfast
        $breakfast = Meal::factory()->breakfast()->create([
            'user_id' => $user->id,
            'eaten_at' => $yesterday->copy()->setTime(8, 15, 0),
        ]);

        $breakfast->mealItems()->create([
            'name' => 'Flocons d\'avoine',
            'calories' => 150,
            'carbs' => 27,
            'fat' => 3,
            'protein' => 5,
            'portion_description' => '40g avec lait',
        ]);

        $breakfast->mealItems()->create([
            'name' => 'Banane',
            'calories' => 95,
            'carbs' => 24,
            'fat' => 0.5,
            'protein' => 1,
            'portion_description' => '1 moyenne (120g)',
        ]);

        $breakfast->mealItems()->create([
            'name' => 'Café au lait',
            'calories' => 25,
            'carbs' => 3,
            'fat' => 1,
            'protein' => 1.5,
            'portion_description' => '1 tasse (200ml)',
        ]);

        $breakfast->updateTotals();

        // Create lunch
        $lunch = Meal::factory()->lunch()->create([
            'user_id' => $user->id,
            'eaten_at' => $yesterday->copy()->setTime(13, 30, 0),
        ]);

        $lunch->mealItems()->create([
            'name' => 'Couscous aux légumes',
            'calories' => 180,
            'carbs' => 35,
            'fat' => 2,
            'protein' => 6,
            'portion_description' => '150g',
        ]);

        $lunch->mealItems()->create([
            'name' => 'Poulet grillé',
            'calories' => 185,
            'carbs' => 0,
            'fat' => 4,
            'protein' => 35,
            'portion_description' => '100g',
        ]);

        $lunch->mealItems()->create([
            'name' => 'Salade verte',
            'calories' => 20,
            'carbs' => 4,
            'fat' => 0,
            'protein' => 2,
            'portion_description' => 'Portion (80g)',
        ]);

        $lunch->updateTotals();

        // Create afternoon snack
        $snack = Meal::factory()->snack()->create([
            'user_id' => $user->id,
            'eaten_at' => $yesterday->copy()->setTime(16, 0, 0),
        ]);

        $snack->mealItems()->create([
            'name' => 'Pomme',
            'calories' => 80,
            'carbs' => 21,
            'fat' => 0.3,
            'protein' => 0.4,
            'portion_description' => '1 moyenne (150g)',
        ]);

        $snack->mealItems()->create([
            'name' => 'Amandes',
            'calories' => 110,
            'carbs' => 4,
            'fat' => 9.5,
            'protein' => 4,
            'portion_description' => '15 amandes (20g)',
        ]);

        $snack->updateTotals();

        // Create dinner
        $dinner = Meal::factory()->dinner()->create([
            'user_id' => $user->id,
            'eaten_at' => $yesterday->copy()->setTime(20, 30, 0),
        ]);

        $dinner->mealItems()->create([
            'name' => 'Tagine de légumes',
            'calories' => 200,
            'carbs' => 30,
            'fat' => 8,
            'protein' => 8,
            'portion_description' => '250g',
        ]);

        $dinner->mealItems()->create([
            'name' => 'Pain marocain',
            'calories' => 140,
            'carbs' => 28,
            'fat' => 1.5,
            'protein' => 5,
            'portion_description' => '1 petit pain (50g)',
        ]);

        $dinner->mealItems()->create([
            'name' => 'Thé à la menthe',
            'calories' => 30,
            'carbs' => 8,
            'fat' => 0,
            'protein' => 0,
            'portion_description' => '1 verre (150ml)',
        ]);

        $dinner->updateTotals();
    }
}