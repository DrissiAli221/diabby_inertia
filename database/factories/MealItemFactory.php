<?php

namespace Database\Factories;

use App\Models\MealItem;
use App\Models\Meal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MealItem>
 */
class MealItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MealItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'meal_id' => Meal::factory(),
            'name' => $this->faker->randomElement([
                'Pain complet', 'Œuf brouillé', 'Yaourt nature', 'Flocons d\'avoine',
                'Fromage blanc', 'Fruits rouges', 'Banane', 'Pomme', 'Muesli',
                'Salade mixte', 'Filet de saumon', 'Poulet grillé', 'Légumes grillés',
                'Riz complet', 'Quinoa', 'Lentilles', 'Tofu', 'Pâtes complètes',
            ]),
            'calories' => $this->faker->numberBetween(50, 300),
            'carbs' => $this->faker->numberBetween(0, 50),
            'fat' => $this->faker->numberBetween(0, 20),
            'protein' => $this->faker->numberBetween(0, 30),
            'quantity' => $this->faker->optional(0.7)->numberBetween(30, 300),
            'unit' => $this->faker->optional(0.7)->randomElement(['g', 'ml', 'portion']),
            'portion_description' => $this->faker->optional(0.5)->randomElement([
                '1 tranche (30g)', '2 tranches (60g)', 'Portion (100g)', 'Bol (250ml)',
                '1 fruit (150g)', '1 œuf (50g)', 'Poignée (30g)', 'Cuillère à soupe (15g)',
            ]),
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (MealItem $mealItem) {
            // Update the meal totals
            $mealItem->meal->updateTotals();
        });
    }

    /**
     * Create a carb-heavy item.
     */
    public function carbHeavy(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'carbs' => $this->faker->numberBetween(30, 60),
                'fat' => $this->faker->numberBetween(0, 10),
                'protein' => $this->faker->numberBetween(0, 15),
                'calories' => function (array $attributes) {
                    // Calculate calories based on macros (4 cal/g for carbs and protein, 9 cal/g for fat)
                    return ($attributes['carbs'] * 4) + ($attributes['protein'] * 4) + ($attributes['fat'] * 9);
                },
            ];
        });
    }

    /**
     * Create a protein-heavy item.
     */
    public function proteinHeavy(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'carbs' => $this->faker->numberBetween(0, 15),
                'fat' => $this->faker->numberBetween(5, 20),
                'protein' => $this->faker->numberBetween(20, 40),
                'calories' => function (array $attributes) {
                    // Calculate calories based on macros
                    return ($attributes['carbs'] * 4) + ($attributes['protein'] * 4) + ($attributes['fat'] * 9);
                },
            ];
        });
    }

    /**
     * Create a fat-heavy item.
     */
    public function fatHeavy(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'carbs' => $this->faker->numberBetween(0, 10),
                'fat' => $this->faker->numberBetween(15, 30),
                'protein' => $this->faker->numberBetween(5, 15),
                'calories' => function (array $attributes) {
                    // Calculate calories based on macros
                    return ($attributes['carbs'] * 4) + ($attributes['protein'] * 4) + ($attributes['fat'] * 9);
                },
            ];
        });
    }

    /**
     * Create a balanced item.
     */
    public function balanced(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'carbs' => $this->faker->numberBetween(10, 25),
                'fat' => $this->faker->numberBetween(5, 15),
                'protein' => $this->faker->numberBetween(10, 25),
                'calories' => function (array $attributes) {
                    // Calculate calories based on macros
                    return ($attributes['carbs'] * 4) + ($attributes['protein'] * 4) + ($attributes['fat'] * 9);
                },
            ];
        });
    }
}