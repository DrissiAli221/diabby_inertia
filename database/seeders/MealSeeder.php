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
        // Get the first user or create one
        $user = User::first() ?? User::factory()->create([
            'name' => 'Drissi Ali',
            'email' => 'drissiali2004@gmail.com',
        ]);

        // Create meals for the past 7 days
        $this->createMealsForUser($user);
    }

    /**
     * Create realistic meals for a user
     */
    private function createMealsForUser(User $user): void
    {
        $now = Carbon::now();
        
        // Create meals for the past 7 days
        for ($day = 7; $day >= 0; $day--) {
            $date = $now->copy()->subDays($day);
            
            // Create breakfast (80% chance)
            if (rand(1, 10) <= 8) {
                $breakfast = Meal::factory()->breakfast()->create([
                    'user_id' => $user->id,
                    'eaten_at' => $date->copy()->setTime(rand(7, 9), rand(0, 59)),
                ]);
                
                // Add typical breakfast items
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
                
                if (rand(1, 10) > 3) {
                    $breakfast->mealItems()->create([
                        'name' => 'Pomme',
                        'calories' => 80,
                        'carbs' => 21,
                        'fat' => 0.3,
                        'protein' => 0.4,
                        'portion_description' => '1 moyenne (150g)',
                    ]);
                }
                
                $breakfast->updateTotals();
            }
            
            // Create lunch (90% chance)
            if (rand(1, 10) <= 9) {
                $lunch = Meal::factory()->lunch()->create([
                    'user_id' => $user->id,
                    'eaten_at' => $date->copy()->setTime(rand(12, 14), rand(0, 59)),
                ]);
                
                // Add typical lunch items
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
                
                $lunch->mealItems()->create([
                    'name' => 'Légumes grillés',
                    'calories' => 120,
                    'carbs' => 15,
                    'fat' => 5,
                    'protein' => 4,
                    'portion_description' => 'Portion (200g)',
                ]);
                
                $lunch->updateTotals();
            }
            
            // Create dinner (85% chance)
            if (rand(1, 10) <= 8.5) {
                $dinner = Meal::factory()->dinner()->create([
                    'user_id' => $user->id,
                    'eaten_at' => $date->copy()->setTime(rand(18, 21), rand(0, 59)),
                ]);
                
                // Add typical dinner items
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
                
                if (rand(1, 10) > 4) {
                    $dinner->mealItems()->create([
                        'name' => 'Pain aux céréales',
                        'calories' => 80,
                        'carbs' => 16,
                        'fat' => 1,
                        'protein' => 3,
                        'portion_description' => '1 tranche (30g)',
                    ]);
                }
                
                $dinner->updateTotals();
            }
            
            // Create snack (50% chance)
            if (rand(1, 10) <= 5) {
                $snack = Meal::factory()->snack()->create([
                    'user_id' => $user->id,
                    'eaten_at' => $date->copy()->setTime(rand(15, 17), rand(0, 59)),
                ]);
                
                // Add typical snack items
                $snack->mealItems()->create([
                    'name' => 'Yaourt grec aux fruits rouges',
                    'calories' => 120,
                    'carbs' => 10,
                    'fat' => 5,
                    'protein' => 15,
                    'portion_description' => 'Pot (150g)',
                ]);
                
                if (rand(1, 10) > 6) {
                    $snack->mealItems()->create([
                        'name' => 'Amandes',
                        'calories' => 90,
                        'carbs' => 3,
                        'fat' => 8,
                        'protein' => 3,
                        'portion_description' => 'Poignée (15g)',
                    ]);
                }
                
                $snack->updateTotals();
            }
        }
    }
}