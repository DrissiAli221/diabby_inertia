<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $period = $request->get('period', 'day');
        
        // Get statistics directly from the User model methods
        $glycemiaStats = $user->getGlycemiaStatistics();
        $nutritionStats = $user->getNutritionStatistics(7); // Last 7 days
        $activityStats = $user->getActivityStatistics(7); // Last 7 days
        $weeklyProgress = $user->getWeeklyActivityProgress();
        
        // Get today's data for all tracking types
        $todayData = $this->getTodayData($user);
        
        // Get recent entries
        $recentEntries = $this->getRecentEntries($user);

        return Inertia::render('Dashboard', [
            'glycemiaStats' => $glycemiaStats,
            'nutritionStats' => $nutritionStats,
            'activityStats' => $activityStats,
            'weeklyProgress' => $weeklyProgress,
            'recentEntries' => $recentEntries,
            'todayData' => $todayData,
        ]);
    }

    /**
     * Get today's data for all tracking types
     */
    private function getTodayData($user)
    {
        return [
            'glucoseReadings' => $user->glycemiaRecords()
                ->whereDate('measured_at', today())
                ->orderBy('measured_at', 'desc')
                ->get(),
                
            'meals' => $user->meals()
                ->whereDate('eaten_at', today())
                ->orderBy('eaten_at', 'desc')
                ->with('mealItems')
                ->get(),
                
            'activities' => $user->activities()
                ->whereDate('activity_date', today())
                ->orderBy('activity_date', 'desc')
                ->get(),
        ];
    }

    /**
     * Get recent entries from all tracking types
     */
    private function getRecentEntries($user)
    {
        $entries = collect();

        // Get recent glucose readings
        $recentGlucose = $user->glycemiaRecords()
            ->whereDate('measured_at', '>=', now()->subDays(3))
            ->orderBy('measured_at', 'desc')
            ->take(5)
            ->get();

        foreach ($recentGlucose as $reading) {
            $entries->push([
                'id' => 'glucose_' . $reading->id,
                'time' => $reading->measured_at->format('g:i A'),
                'date' => $reading->measured_at->format('M d'),
                'type' => 'Glucose',
                'typeColor' => 'bg-blue-100 text-blue-800',
                'value' => round($reading->value * 18) . ' mg/dL', // Convert to mg/dL
                'notes' => $reading->note ?: $reading->context,
                'icon' => '🩸',
                'created_at' => $reading->measured_at->toISOString(),
            ]);
        }

        // Get recent meals
        $recentMeals = $user->meals()
            ->whereDate('eaten_at', '>=', now()->subDays(3))
            ->orderBy('eaten_at', 'desc')
            ->take(5)
            ->get();

        foreach ($recentMeals as $meal) {
            $entries->push([
                'id' => 'meal_' . $meal->id,
                'time' => $meal->eaten_at->format('g:i A'),
                'date' => $meal->eaten_at->format('M d'),
                'type' => 'Meal',
                'typeColor' => 'bg-green-100 text-green-800',
                'value' => $meal->meal_icon . ' ' . $meal->meal_type_in_french,
                'notes' => round($meal->total_calories) . ' cal, ' . round($meal->total_carbs) . 'g carbs',
                'icon' => '🍽️',
                'created_at' => $meal->eaten_at->toISOString(),
            ]);
        }

        // Get recent activities
        $recentActivities = $user->activities()
            ->whereDate('activity_date', '>=', now()->subDays(3))
            ->orderBy('activity_date', 'desc')
            ->take(5)
            ->get();

        foreach ($recentActivities as $activity) {
            $entries->push([
                'id' => 'activity_' . $activity->id,
                'time' => $activity->activity_date->format('g:i A'),
                'date' => $activity->activity_date->format('M d'),
                'type' => 'Activity',
                'typeColor' => 'bg-purple-100 text-purple-800',
                'value' => $activity->activity_icon . ' ' . $activity->activity_type_in_french,
                'notes' => $activity->formatted_duration . ', ' . $activity->formatted_calories,
                'icon' => '🚶',
                'created_at' => $activity->activity_date->toISOString(),
            ]);
        }

        return $entries->sortByDesc('created_at')->take(10)->values();
    }
}