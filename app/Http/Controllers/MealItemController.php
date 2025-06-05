<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\MealItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class MealItemController extends Controller
{
    /**
     * Store a newly created meal item in storage.
     */
    public function store(Request $request, Meal $meal)
    {
        // Ensure the meal belongs to the authenticated user
        if ($meal->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'calories' => 'required|numeric|min:0',
            'carbs' => 'required|numeric|min:0',
            'fat' => 'required|numeric|min:0',
            'protein' => 'required|numeric|min:0',
            'quantity' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'portion_description' => 'nullable|string|max:255',
        ]);

        $meal->mealItems()->create($validated);
        
        // The meal totals will be updated automatically via the model events

        return redirect()->route('nutrition.index', ['date' => Carbon::parse($meal->eaten_at)->format('Y-m-d')])
            ->with('success', 'Aliment ajouté avec succès.');
    }

    /**
     * Update the specified meal item in storage.
     */
    public function update(Request $request, MealItem $mealItem)
    {
        // Ensure the meal item belongs to the authenticated user
        if ($mealItem->meal->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'calories' => 'sometimes|required|numeric|min:0',
            'carbs' => 'sometimes|required|numeric|min:0',
            'fat' => 'sometimes|required|numeric|min:0',
            'protein' => 'sometimes|required|numeric|min:0',
            'quantity' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'portion_description' => 'nullable|string|max:255',
        ]);

        $mealItem->update($validated);
        
        // The meal totals will be updated automatically via the model events

        return redirect()->route('nutrition.index', ['date' => Carbon::parse($mealItem->meal->eaten_at)->format('Y-m-d')])
            ->with('success', 'Aliment mis à jour avec succès.');
    }

    /**
     * Remove the specified meal item from storage.
     */
    public function destroy(MealItem $mealItem)
    {
        // Ensure the meal item belongs to the authenticated user
        if ($mealItem->meal->user_id !== Auth::id()) {
            abort(403);
        }

        $date = Carbon::parse($mealItem->meal->eaten_at)->format('Y-m-d');
        
        $mealItem->delete();
        
        // The meal totals will be updated automatically via the model events

        return redirect()->route('nutrition.index', ['date' => $date])
            ->with('success', 'Aliment supprimé avec succès.');
    }

    /**
     * Search for food items in the database.
     */
    public function search(Request $request)
    {
        $query = $request->input('query');
        
        // In a real app, this would search a food database
        // For now, we'll return some mock data
        $results = $this->getMockFoodDatabase($query);
        
        return response()->json($results);
    }

    /**
     * Get nutritional information for a food item.
     */
    public function getNutrition(Request $request)
    {
        $foodId = $request->input('food_id');
        $quantity = $request->input('quantity', 100);
        
        // In a real app, this would fetch from a food database
        // For now, we'll return some mock data
        $mockFoods = $this->getMockFoodDatabase();
        
        $food = collect($mockFoods)->firstWhere('id', $foodId);
        
        if (!$food) {
            return response()->json(['error' => 'Food not found'], 404);
        }
        
        // Calculate nutrition based on quantity
        $ratio = $quantity / 100; // Assuming the base data is per 100g/ml
        
        $nutrition = [
            'name' => $food['name'],
            'calories' => round($food['calories'] * $ratio, 1),
            'carbs' => round($food['carbs'] * $ratio, 1),
            'fat' => round($food['fat'] * $ratio, 1),
            'protein' => round($food['protein'] * $ratio, 1),
            'quantity' => $quantity,
            'unit' => $food['unit'],
        ];
        
        return response()->json($nutrition);
    }

    /**
     * Get a mock food database for demonstration.
     */
    private function getMockFoodDatabase($query = null)
    {
        $foods = [
            [
                'id' => 1,
                'name' => 'Pain complet',
                'calories' => 240,
                'carbs' => 48,
                'fat' => 3,
                'protein' => 12,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => '1 tranche (40g)',
                'category' => 'Céréales et féculents',
            ],
            [
                'id' => 2,
                'name' => 'Œuf',
                'calories' => 155,
                'carbs' => 1.1,
                'fat' => 10.8,
                'protein' => 12.6,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => '1 œuf (50g)',
                'category' => 'Protéines animales',
            ],
            [
                'id' => 3,
                'name' => 'Pomme',
                'calories' => 52,
                'carbs' => 14,
                'fat' => 0.2,
                'protein' => 0.3,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => '1 moyenne (150g)',
                'category' => 'Fruits',
            ],
            [
                'id' => 4,
                'name' => 'Salade mixte',
                'calories' => 15,
                'carbs' => 3,
                'fat' => 0.2,
                'protein' => 1.5,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => 'Portion (100g)',
                'category' => 'Légumes',
            ],
            [
                'id' => 5,
                'name' => 'Filet de saumon',
                'calories' => 160,
                'carbs' => 0,
                'fat' => 7,
                'protein' => 22,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => 'Filet (150g)',
                'category' => 'Protéines animales',
            ],
            [
                'id' => 6,
                'name' => 'Légumes grillés',
                'calories' => 60,
                'carbs' => 7.5,
                'fat' => 2.5,
                'protein' => 2,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => 'Portion (200g)',
                'category' => 'Légumes',
            ],
            [
                'id' => 7,
                'name' => 'Soupe de légumes',
                'calories' => 48,
                'carbs' => 7.2,
                'fat' => 1.5,
                'protein' => 2.5,
                'unit' => 'ml',
                'portion_size' => 100,
                'typical_portion' => 'Bol (250ml)',
                'category' => 'Soupes',
            ],
            [
                'id' => 8,
                'name' => 'Fromage blanc',
                'calories' => 80,
                'carbs' => 4,
                'fat' => 0.5,
                'protein' => 15,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => 'Portion (100g)',
                'category' => 'Produits laitiers',
            ],
            [
                'id' => 9,
                'name' => 'Pain aux céréales',
                'calories' => 260,
                'carbs' => 48,
                'fat' => 3.5,
                'protein' => 13,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => '1 tranche (30g)',
                'category' => 'Céréales et féculents',
            ],
            [
                'id' => 10,
                'name' => 'Yaourt grec',
                'calories' => 120,
                'carbs' => 5,
                'fat' => 5,
                'protein' => 15,
                'unit' => 'g',
                'portion_size' => 100,
                'typical_portion' => 'Pot (150g)',
                'category' => 'Produits laitiers',
            ],
        ];
        
        if ($query) {
            return collect($foods)
                ->filter(function ($food) use ($query) {
                    return stripos($food['name'], $query) !== false || 
                           stripos($food['category'], $query) !== false;
                })
                ->values()
                ->all();
        }
        
        return $foods;
    }
}