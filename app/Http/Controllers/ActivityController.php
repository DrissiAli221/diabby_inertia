<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\GlycemiaRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ActivityController extends Controller
{
    /**
     * Display the activity tracking page.
     */
    public function index(): Response
    {
        // Get recent activities
        $activities = Auth::user()
            ->activities()
            ->recent(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'activity_type' => $activity->activity_type,
                    'activity_type_french' => $activity->activity_type_in_french,
                    'activity_icon' => $activity->activity_icon,
                    'activity_color' => $activity->activity_color,
                    'duration_minutes' => $activity->duration_minutes,
                    'formatted_duration' => $activity->formatted_duration,
                    'intensity' => $activity->intensity,
                    'intensity_french' => $activity->intensity_in_french,
                    'intensity_color' => $activity->intensity_color,
                    'burned_calories' => $activity->burned_calories,
                    'formatted_calories' => $activity->formatted_calories,
                    'time' => $activity->time,
                    'date' => $activity->date,
                    'estimated_glycemia_impact' => $activity->estimated_glycemia_impact,
                    'motivational_message' => $activity->motivational_message,
                    'met_value' => $activity->met_value,
                    'is_cardio' => $activity->isCardio(),
                    'is_strength' => $activity->isStrength(),
                    'is_flexibility' => $activity->isFlexibility(),
                ];
            });

        // Calculate weekly progress
        $weeklyGoal = 150; // minutes per week (WHO recommendation)
        $thisWeekActivities = Auth::user()->activities()->thisWeek()->get();
        $weeklyTotal = $thisWeekActivities->sum('duration_minutes');
        $weeklyProgress = min(100, round(($weeklyTotal / $weeklyGoal) * 100));

        // Calculate activity type distribution for this week
        $activityDistribution = $thisWeekActivities
            ->groupBy('activity_type')
            ->map(function ($activities, $type) use ($weeklyTotal) {
                $typeTotal = $activities->sum('duration_minutes');
                return [
                    'type' => $type,
                    'type_french' => $activities->first()->activity_type_in_french,
                    'icon' => $activities->first()->activity_icon,
                    'minutes' => $typeTotal,
                    'percentage' => $weeklyTotal > 0 ? round(($typeTotal / $weeklyTotal) * 100) : 0,
                ];
            })
            ->values()
            ->sortByDesc('minutes')
            ->take(3);

        // Get today's glycemia readings for correlation
        $todayGlycemia = Auth::user()
            ->glycemiaRecords()
            ->whereDate('measured_at', today())
            ->orderBy('measured_at', 'desc')
            ->first();

        // Calculate health benefits based on recent activity
        $healthBenefits = $this->calculateHealthBenefits($thisWeekActivities);

        // Get personalized recommendations
        $recommendations = $this->getPersonalizedRecommendations($thisWeekActivities, $todayGlycemia);

        return Inertia::render('Activity/Index', [
            'activities' => $activities,
            'weeklyProgress' => [
                'goal' => $weeklyGoal,
                'achieved' => $weeklyTotal,
                'percentage' => $weeklyProgress,
                'remaining' => max(0, $weeklyGoal - $weeklyTotal),
            ],
            'activityDistribution' => $activityDistribution,
            'healthBenefits' => $healthBenefits,
            'recommendations' => $recommendations,
            'todayGlycemia' => $todayGlycemia ? [
                'value' => $todayGlycemia->value,
                'formatted_value' => $todayGlycemia->formatted_value,
                'status' => $todayGlycemia->status_label,
                'time' => $todayGlycemia->measured_at->format('H:i'),
            ] : null,
            'activityTypes' => $this->getActivityTypes(),
        ]);
    }

    /**
     * Store a newly created activity in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_type' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1|max:600',
            'intensity' => 'required|in:low,moderate,high',
            'activity_date' => 'required|date',
        ]);

        // Calculate burned calories based on activity type, duration, and intensity
        $burnedCalories = $this->calculateBurnedCalories(
            $validated['activity_type'],
            $validated['duration_minutes'],
            $validated['intensity']
        );

        Auth::user()->activities()->create([
            'activity_type' => $validated['activity_type'],
            'duration_minutes' => $validated['duration_minutes'],
            'intensity' => $validated['intensity'],
            'burned_calories' => $burnedCalories,
            'activity_date' => $validated['activity_date'],
        ]);

        return redirect()->route('activity.index')
            ->with('success', 'Activité enregistrée avec succès.');
    }

    /**
     * Update the specified activity in storage.
     */
    public function update(Request $request, Activity $activity)
    {
        // Ensure the activity belongs to the authenticated user
        if ($activity->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'activity_type' => 'sometimes|required|string|max:255',
            'duration_minutes' => 'sometimes|required|integer|min:1|max:600',
            'intensity' => 'sometimes|required|in:low,moderate,high',
            'activity_date' => 'sometimes|required|date',
        ]);

        // Recalculate burned calories if relevant fields changed
        if (isset($validated['activity_type']) || isset($validated['duration_minutes']) || isset($validated['intensity'])) {
            $validated['burned_calories'] = $this->calculateBurnedCalories(
                $validated['activity_type'] ?? $activity->activity_type,
                $validated['duration_minutes'] ?? $activity->duration_minutes,
                $validated['intensity'] ?? $activity->intensity
            );
        }

        $activity->update($validated);

        return redirect()->route('activity.index')
            ->with('success', 'Activité mise à jour avec succès.');
    }

    /**
     * Remove the specified activity from storage.
     */
    public function destroy(Activity $activity)
    {
        // Ensure the activity belongs to the authenticated user
        if ($activity->user_id !== Auth::id()) {
            abort(403);
        }

        $activity->delete();

        return redirect()->route('activity.index')
            ->with('success', 'Activité supprimée avec succès.');
    }

    /**
     * Get activity statistics.
     */
    public function statistics(Request $request)
    {
        $period = $request->get('period', 'week'); // week, month, year
        
        $query = Auth::user()->activities();
        
        switch ($period) {
            case 'week':
                $query->thisWeek();
                break;
            case 'month':
                $query->thisMonth();
                break;
            case 'year':
                $query->whereYear('activity_date', now()->year);
                break;
        }
        
        $activities = $query->get();
        
        return response()->json([
            'total_activities' => $activities->count(),
            'total_duration' => $activities->sum('duration_minutes'),
            'total_calories' => $activities->sum('burned_calories'),
            'average_duration' => $activities->avg('duration_minutes'),
            'most_common_activity' => $activities->groupBy('activity_type')
                ->map->count()
                ->sortDesc()
                ->keys()
                ->first(),
            'intensity_distribution' => [
                'low' => $activities->where('intensity', 'low')->count(),
                'moderate' => $activities->where('intensity', 'moderate')->count(),
                'high' => $activities->where('intensity', 'high')->count(),
            ],
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

    /**
     * Calculate health benefits based on recent activities.
     */
    private function calculateHealthBenefits($activities)
    {
        $totalMinutes = $activities->sum('duration_minutes');
        $cardioMinutes = $activities->filter(fn($a) => in_array($a->activity_type, ['walking', 'running', 'cycling', 'swimming']))->sum('duration_minutes');
        $strengthMinutes = $activities->filter(fn($a) => in_array($a->activity_type, ['strength_training', 'gym']))->sum('duration_minutes');
        
        return [
            'glycemia_stability' => [
                'level' => $totalMinutes >= 150 ? 'excellent' : ($totalMinutes >= 75 ? 'good' : 'fair'),
                'description' => 'Glycémie plus stable',
                'progress' => min(100, round(($totalMinutes / 150) * 100)),
            ],
            'weight_management' => [
                'level' => $cardioMinutes >= 75 ? 'excellent' : ($cardioMinutes >= 30 ? 'good' : 'fair'),
                'description' => 'Gestion du poids',
                'progress' => min(100, round(($cardioMinutes / 75) * 100)),
            ],
            'mood' => [
                'level' => $totalMinutes >= 60 ? 'excellent' : ($totalMinutes >= 30 ? 'good' : 'fair'),
                'description' => 'Humeur positive',
                'progress' => min(100, round(($totalMinutes / 60) * 100)),
            ],
        ];
    }

    /**
     * Get personalized recommendations based on activity history.
     */
    private function getPersonalizedRecommendations($activities, $glycemia)
    {
        $recommendations = [];
        
        $totalMinutes = $activities->sum('duration_minutes');
        $cardioActivities = $activities->filter(fn($a) => in_array($a->activity_type, ['walking', 'running', 'cycling']));
        
        // Post-meal walking recommendation
        if ($glycemia && $glycemia->value > 7.0) {
            $recommendations[] = [
                'icon' => '🚶',
                'title' => 'Marche après les repas',
                'description' => '15 minutes de marche après chaque repas peut réduire les pics glycémiques de 30%.',
                'type' => 'glycemia',
                'priority' => 'high',
            ];
        }
        
        // Activity frequency recommendation
        if ($totalMinutes < 150) {
            $recommendations[] = [
                'icon' => '🎯',
                'title' => 'Fractionnez votre activité',
                'description' => '3 sessions de 10 minutes peuvent être aussi efficaces qu\'une session de 30 minutes.',
                'type' => 'frequency',
                'priority' => 'medium',
            ];
        }
        
        // Strength training recommendation
        $strengthActivities = $activities->filter(fn($a) => $a->activity_type === 'strength_training');
        if ($strengthActivities->count() < 2) {
            $recommendations[] = [
                'icon' => '💪',
                'title' => 'Force et équilibre',
                'description' => 'Intégrez des exercices de renforcement 2 fois par semaine pour améliorer la sensibilité à l\'insuline.',
                'type' => 'strength',
                'priority' => 'medium',
            ];
        }
        
        return $recommendations;
    }

    /**
     * Get available activity types.
     */
    private function getActivityTypes()
    {
        return [
            ['value' => 'walking', 'label' => 'Marche', 'icon' => '🚶', 'category' => 'cardio'],
            ['value' => 'running', 'label' => 'Course à pied', 'icon' => '🏃', 'category' => 'cardio'],
            ['value' => 'cycling', 'label' => 'Vélo', 'icon' => '🚴', 'category' => 'cardio'],
            ['value' => 'swimming', 'label' => 'Natation', 'icon' => '🏊', 'category' => 'cardio'],
            ['value' => 'strength_training', 'label' => 'Exercices de renforcement', 'icon' => '🏋️', 'category' => 'strength'],
            ['value' => 'yoga', 'label' => 'Yoga', 'icon' => '🧘', 'category' => 'flexibility'],
            ['value' => 'hiking', 'label' => 'Randonnée', 'icon' => '🥾', 'category' => 'cardio'],
            ['value' => 'dancing', 'label' => 'Danse', 'icon' => '💃', 'category' => 'cardio'],
            ['value' => 'tennis', 'label' => 'Tennis', 'icon' => '🎾', 'category' => 'sport'],
            ['value' => 'football', 'label' => 'Football', 'icon' => '⚽', 'category' => 'sport'],
            ['value' => 'basketball', 'label' => 'Basketball', 'icon' => '🏀', 'category' => 'sport'],
            ['value' => 'gym', 'label' => 'Salle de sport', 'icon' => '💪', 'category' => 'mixed'],
        ];
    }
}