<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\GlycemiaRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class MealController extends Controller
{
    /**
     * Display the nutrition tracking page.
     */
    public function index(Request $request): Response
    {
        // Get the date from the request or use today
        $date = $request->date ? Carbon::parse($request->date) : today();
        
        // Get all meals for the selected date
        $meals = Auth::user()
            ->meals()
            ->forDate($date)
            ->orderBy('eaten_at')
            ->with('mealItems')
            ->get()
            ->map(function ($meal) {
                return [
                    'id' => $meal->id,
                    'meal_type' => $meal->meal_type,
                    'meal_type_french' => $meal->meal_type_in_french,
                    'meal_icon' => $meal->meal_icon,
                    'time' => $meal->time,
                    'total_calories' => $meal->total_calories,
                    'total_carbs' => $meal->total_carbs,
                    'total_fat' => $meal->total_fat,
                    'total_protein' => $meal->total_protein,
                    'background_color' => $meal->getBackgroundColorClass(),
                    'text_color' => $meal->getTextColorClass(),
                    'items' => $meal->mealItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'portion_description' => $item->portion_description,
                            'calories' => $item->calories,
                            'carbs' => $item->carbs,
                            'fat' => $item->fat,
                            'protein' => $item->protein,
                            'formatted_calories' => $item->formatted_calories,
                            'formatted_carbs' => $item->formatted_carbs,
                            'category_color' => $item->getFoodCategoryColor(),
                        ];
                    }),
                ];
            });
            
        // Calculate daily totals
        $dailyTotals = [
            'calories' => $meals->sum('total_calories'),
            'carbs' => $meals->sum('total_carbs'),
            'protein' => $meals->sum('total_protein'),
            'fat' => $meals->sum('total_fat'),
        ];
        
        // Get glycemia readings for the day
        $glycemiaReadings = Auth::user()
            ->glycemiaRecords()
            ->whereDate('measured_at', $date)
            ->orderBy('measured_at')
            ->get()
            ->map(function ($reading) {
                return [
                    'id' => $reading->id,
                    'time' => Carbon::parse($reading->measured_at)->format('H:i'),
                    'value' => $reading->value,
                    'value_with_unit' => $reading->value . ' mmol/L',
                    'value_mg_dl' => round($reading->value * 18), // Convert mmol/L to mg/dL
                    'value_mg_dl_with_unit' => round($reading->value * 18) . ' mg/dL',
                    'context' => $this->getContextFromTime($reading->measured_at),
                    'status' => $this->getStatusLabel($reading->status),
                    'status_class' => $this->getStatusClass($reading->status),
                ];
            });
            
        // Get recipe suggestions
        $recipeSuggestions = $this->getRecipeSuggestions();
        
        // Get nutritional tips
        $nutritionalTips = $this->getNutritionalTips();
        
        return Inertia::render('Nutrition/Index', [
            'date' => [
                'value' => $date->format('Y-m-d'),
                'formatted' => $date->locale('fr')->isoFormat('dddd, D MMMM YYYY'),
                'previous' => $date->copy()->subDay()->format('Y-m-d'),
                'next' => $date->copy()->addDay()->format('Y-m-d'),
            ],
            'meals' => $meals,
            'dailyTotals' => $dailyTotals,
            'glycemiaReadings' => $glycemiaReadings,
            'recipeSuggestions' => $recipeSuggestions,
            'nutritionalTips' => $nutritionalTips,
            'mealTypes' => [
                ['value' => 'breakfast', 'label' => 'Petit déjeuner', 'icon' => '🍳', 'default_time' => '07:30'],
                ['value' => 'lunch', 'label' => 'Déjeuner', 'icon' => '🍽️', 'default_time' => '12:30'],
                ['value' => 'dinner', 'label' => 'Dîner', 'icon' => '🌙', 'default_time' => '19:15'],
                ['value' => 'snack', 'label' => 'Collation', 'icon' => '🍎', 'default_time' => '16:00'],
            ],
        ]);
    }

   /**
 * Store a newly created meal in storage.
 */
public function store(Request $request)
{
    $validated = $request->validate([
        'meal_type' => 'required|in:breakfast,lunch,dinner,snack',
        'eaten_at' => 'required|date',
        'eaten_time' => 'nullable|date_format:H:i', // Optional time field
    ]);

    // Parse the base date
    $baseDate = Carbon::parse($validated['eaten_at']);
    
    // If time is provided, use it; otherwise use default time for meal type
    if (isset($validated['eaten_time'])) {
        $eatenAt = $baseDate->setTimeFromTimeString($validated['eaten_time']);
    } else {
        $defaultTime = Meal::getDefaultTimeForMealType($validated['meal_type']);
        $eatenAt = $baseDate->setTimeFromTimeString($defaultTime);
    }

    // Ensure we're working in the correct timezone
    $eatenAt = $eatenAt->timezone(config('app.timezone'));

    $meal = Auth::user()->meals()->create([
        'meal_type' => $validated['meal_type'],
        'eaten_at' => $eatenAt,
        'total_calories' => 0,
        'total_carbs' => 0,
        'total_fat' => 0,
        'total_protein' => 0,
    ]);

    return redirect()->route('nutrition.index', ['date' => $eatenAt->format('Y-m-d')])
        ->with('success', 'Repas ajouté avec succès.');
}

    /**
     * Update the specified meal in storage.
     */
    public function update(Request $request, Meal $meal)
    {
        // Ensure the meal belongs to the authenticated user
        if ($meal->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'meal_type' => 'sometimes|required|in:breakfast,lunch,dinner,snack',
            'eaten_at' => 'sometimes|required|date',
        ]);

        $meal->update($validated);

        return redirect()->route('nutrition.index', ['date' => Carbon::parse($meal->eaten_at)->format('Y-m-d')])
            ->with('success', 'Repas mis à jour avec succès.');
    }

    /**
     * Remove the specified meal from storage.
     */
    public function destroy(Meal $meal)
    {
        // Ensure the meal belongs to the authenticated user
        if ($meal->user_id !== Auth::id()) {
            abort(403);
        }

        $date = Carbon::parse($meal->eaten_at)->format('Y-m-d');
        
        $meal->delete();

        return redirect()->route('nutrition.index', ['date' => $date])
            ->with('success', 'Repas supprimé avec succès.');
    }

    /**
     * Get daily nutrition statistics.
     */
    public function statistics(Request $request)
    {
        // Get the date from the request or use today
        $date = $request->date ? Carbon::parse($request->date) : today();
        
        // Get all meals for the selected date
        $meals = Auth::user()
            ->meals()
            ->forDate($date)
            ->with('mealItems')
            ->get();
            
        // Calculate daily totals
        $dailyTotals = [
            'calories' => $meals->sum('total_calories'),
            'carbs' => $meals->sum('total_carbs'),
            'protein' => $meals->sum('total_protein'),
            'fat' => $meals->sum('total_fat'),
        ];
        
        // Get meal counts
        $mealCounts = [
            'breakfast' => $meals->where('meal_type', 'breakfast')->count(),
            'lunch' => $meals->where('meal_type', 'lunch')->count(),
            'dinner' => $meals->where('meal_type', 'dinner')->count(),
            'snack' => $meals->where('meal_type', 'snack')->count(),
        ];
        
        // Get glycemia readings for the day
        $glycemiaReadings = Auth::user()
            ->glycemiaRecords()
            ->whereDate('measured_at', $date)
            ->get();
            
        $glycemiaStats = [
            'count' => $glycemiaReadings->count(),
            'average' => $glycemiaReadings->avg('value') ? round($glycemiaReadings->avg('value'), 1) : null,
            'min' => $glycemiaReadings->min('value'),
            'max' => $glycemiaReadings->max('value'),
            'normal_count' => $glycemiaReadings->where('status', 'normal')->count(),
            'high_count' => $glycemiaReadings->where('status', 'high')->count(),
            'low_count' => $glycemiaReadings->where('status', 'low')->count(),
        ];
        
        return response()->json([
            'date' => $date->format('Y-m-d'),
            'dailyTotals' => $dailyTotals,
            'mealCounts' => $mealCounts,
            'glycemiaStats' => $glycemiaStats,
        ]);
    }

    /**
     * Get recipe suggestions based on user data.
     */
    private function getRecipeSuggestions()
    {
        // In a real app, this would be based on user preferences, glycemia patterns, etc.
        return [
            [
                'id' => 1,
                'name' => 'Poulet grillé aux herbes',
                'description' => 'Avec quinoa et légumes de saison',
                'image' => 'https://images.unsplash.com/photo-1597577652129-7ffad9d37ad4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'preparation_time' => 30,
                'calories' => 280,
                'glycemic_index' => 'bas',
                'macros' => [
                    'carbs' => 25,
                    'protein' => 30,
                    'fat' => 8,
                ],
            ],
            [
                'id' => 2,
                'name' => 'Yaourt grec aux fruits rouges',
                'description' => 'Avec amandes et graines de chia',
                'image' => 'https://plus.unsplash.com/premium_photo-1668615553418-36ecec70eccb?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'preparation_time' => 5,
                'calories' => 120,
                'glycemic_index' => 'bas',
                'macros' => [
                    'carbs' => 10,
                    'protein' => 15,
                    'fat' => 5,
                ],
            ],
        ];
    }

    /**
     * Get nutritional tips.
     */
    private function getNutritionalTips()
    {
        return [
            [
                'id' => 1,
                'icon' => 'warning',
                'title' => 'Essayez de manger à des heures régulières',
                'description' => 'Pour maintenir une glycémie stable tout au long de la journée.',
                'color' => 'orange',
            ],
            [
                'id' => 2,
                'icon' => 'check',
                'title' => 'Privilégiez les légumes verts à feuilles',
                'description' => 'Ils ont un faible impact sur votre glycémie.',
                'color' => 'green',
            ],
            [
                'id' => 3,
                'icon' => 'info',
                'title' => 'Boire suffisamment d\'eau aide à réguler votre glycémie',
                'description' => 'et à éviter la déshydratation.',
                'color' => 'blue',
            ],
        ];
    }

    /**
     * Get status label in French
     */
    private function getStatusLabel($status): string
    {
        return match($status) {
            'high' => 'Élevé',
            'low' => 'Bas',
            'normal' => 'Normal',
            default => 'Normal'
        };
    }

    /**
     * Get status CSS class
     */
    private function getStatusClass($status): string
    {
        return match($status) {
            'high' => 'text-red-600',
            'low' => 'text-orange-600',
            'normal' => 'text-green-600',
            default => 'text-gray-600'
        };
    }

    /**
     * Get context based on time of measurement
     */
    private function getContextFromTime($measuredAt): string
    {
        $hour = Carbon::parse($measuredAt)->hour;
        
        if ($hour >= 6 && $hour < 9) {
            return 'Avant le petit déjeuner';
        } elseif ($hour >= 9 && $hour < 12) {
            return 'Avant le déjeuner';
        } elseif ($hour >= 12 && $hour < 15) {
            return 'Après le déjeuner';
        } elseif ($hour >= 15 && $hour < 19) {
            return 'Avant le dîner';
        } elseif ($hour >= 19 && $hour < 22) {
            return 'Après le dîner';
        } else {
            return 'Au coucher';
        }
    }
}