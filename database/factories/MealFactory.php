<?php

namespace Database\Factories;

use App\Models\Meal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Meal>
 */
class MealFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Meal::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'meal_type' => $this->faker->randomElement(['breakfast', 'lunch', 'dinner', 'snack']),
            'total_calories' => 0, // Will be calculated from items
            'total_carbs' => 0,
            'total_fat' => 0,
            'total_protein' => 0,
            'eaten_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Meal $meal) {
            // Create 2-5 meal items for this meal
            $itemCount = rand(2, 5);
            
            for ($i = 0; $i < $itemCount; $i++) {
                $meal->mealItems()->create([
                    'name' => $this->getRandomFoodName($meal->meal_type),
                    'calories' => $this->faker->numberBetween(50, 300),
                    'carbs' => $this->faker->numberBetween(0, 50),
                    'fat' => $this->faker->numberBetween(0, 20),
                    'protein' => $this->faker->numberBetween(0, 30),
                    'portion_description' => $this->getRandomPortionDescription(),
                ]);
            }
            
            // Update meal totals
            $meal->updateTotals();
        });
    }

    /**
     * Create a breakfast meal.
     */
    public function breakfast(): static
    {
        return $this->state(function (array $attributes) {
            $date = isset($attributes['eaten_at']) ? Carbon::parse($attributes['eaten_at']) : Carbon::today();
            return [
                'meal_type' => 'breakfast',
                'eaten_at' => $date->copy()->setTime(rand(7, 9), rand(0, 59)),
            ];
        });
    }

    /**
     * Create a lunch meal.
     */
    public function lunch(): static
    {
        return $this->state(function (array $attributes) {
            $date = isset($attributes['eaten_at']) ? Carbon::parse($attributes['eaten_at']) : Carbon::today();
            return [
                'meal_type' => 'lunch',
                'eaten_at' => $date->copy()->setTime(rand(12, 14), rand(0, 59)),
            ];
        });
    }

    /**
     * Create a dinner meal.
     */
    public function dinner(): static
    {
        return $this->state(function (array $attributes) {
            $date = isset($attributes['eaten_at']) ? Carbon::parse($attributes['eaten_at']) : Carbon::today();
            return [
                'meal_type' => 'dinner',
                'eaten_at' => $date->copy()->setTime(rand(18, 21), rand(0, 59)),
            ];
        });
    }

    /**
     * Create a snack meal.
     */
    public function snack(): static
    {
        return $this->state(function (array $attributes) {
            $date = isset($attributes['eaten_at']) ? Carbon::parse($attributes['eaten_at']) : Carbon::today();
            
            // Randomly choose morning or afternoon snack
            $isAfternoon = $this->faker->boolean();
            
            return [
                'meal_type' => 'snack',
                'eaten_at' => $isAfternoon 
                    ? $date->copy()->setTime(rand(15, 17), rand(0, 59))
                    : $date->copy()->setTime(rand(10, 11), rand(0, 59)),
            ];
        });
    }

    /**
     * Get a random food name based on meal type.
     */
    private function getRandomFoodName(string $mealType): string
    {
        $breakfastFoods = [
            'Pain complet', 'Œuf brouillé', 'Yaourt nature', 'Flocons d\'avoine',
            'Fromage blanc', 'Fruits rouges', 'Banane', 'Pomme', 'Muesli',
            'Lait d\'amande', 'Jus d\'orange', 'Thé vert',
        ];
        
        $lunchDinnerFoods = [
            'Salade mixte', 'Filet de saumon', 'Poulet grillé', 'Légumes grillés',
            'Riz complet', 'Quinoa', 'Lentilles', 'Tofu', 'Pâtes complètes',
            'Brocoli', 'Carottes', 'Patate douce', 'Avocat', 'Huile d\'olive',
        ];
        
        $snackFoods = [
            'Yaourt grec', 'Amandes', 'Noix', 'Fruits secs', 'Pomme',
            'Carré de chocolat noir', 'Barre protéinée', 'Fromage blanc',
            'Houmous', 'Bâtonnets de légumes',
        ];
        
        switch ($mealType) {
            case 'breakfast':
                return $this->faker->randomElement($breakfastFoods);
            case 'lunch':
            case 'dinner':
                return $this->faker->randomElement($lunchDinnerFoods);
            case 'snack':
                return $this->faker->randomElement($snackFoods);
            default:
                return $this->faker->randomElement(array_merge($breakfastFoods, $lunchDinnerFoods, $snackFoods));
        }
    }

    /**
     * Get a random portion description.
     */
    private function getRandomPortionDescription(): string
    {
        $portions = [
            '1 tranche (30g)', '2 tranches (60g)', 'Portion (100g)', 'Bol (250ml)',
            '1 fruit (150g)', '1 œuf (50g)', 'Poignée (30g)', 'Cuillère à soupe (15g)',
            'Filet (150g)', 'Tasse (200ml)', 'Petit bol (150g)', 'Assiette (300g)',
        ];
        
        return $this->faker->randomElement($portions);
    }
}