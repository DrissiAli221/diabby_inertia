<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $currentMonth = $request->get('month', now()->month);
        $currentYear = $request->get('year', now()->year);

        // Just calculate the range for display
        $startDate = Carbon::create($currentYear, $currentMonth, 1)->startOfMonth()->startOfWeek();
        $endDate = Carbon::create($currentYear, $currentMonth, 1)->endOfMonth()->endOfWeek();

        $calendarData = $this->getCalendarData($user);

        return Inertia::render('Calendar/Index', [
            'calendarData' => $calendarData,
            'currentMonth' => (int) $currentMonth,
            'currentYear' => (int) $currentYear,
        ]);
    }

    private function getCalendarData($user)
    {
        // Get all glucose readings
        $glucoseReadings = $user->glycemiaRecords()
            ->orderBy('measured_at')
            ->get()
            ->groupBy(function ($item) {
                return $item->measured_at->format('Y-m-d');
            });

        // Get all meals
        $meals = $user->meals()
            ->with('mealItems')
            ->orderBy('created_at')
            ->get()
            ->groupBy(function ($item) {
                return $item->created_at->format('Y-m-d');
            });

        // Get all activities
        $activities = $user->activities()
            ->get()
            ->filter(function ($item) {
                return !is_null($item->performed_at);
            })
            ->groupBy(function ($item) {
                return $item->performed_at->format('Y-m-d');
            });
        // Combine all data
        $dates = $glucoseReadings->keys()
            ->merge($meals->keys())
            ->merge($activities->keys())
            ->unique()
            ->sort();

        $calendarData = [];

        foreach ($dates as $dateKey) {
            $dayGlucose = $glucoseReadings->get($dateKey, collect());
            $dayMeals = $meals->get($dateKey, collect());
            $dayActivities = $activities->get($dateKey, collect());

            $dayMeals = $dayMeals->map(function ($meal) {
                $meal->total_calories = $meal->mealItems->sum('calories');
                return $meal;
            });

            $calendarData[$dateKey] = [
                'glucose_readings' => $dayGlucose->map(function ($reading) {
                    return [
                        'id' => $reading->id,
                        'glucose_level' => $reading->glucose_level,
                        'measured_at' => $reading->measured_at->toISOString(),
                        'measurement_type' => $reading->measurement_type,
                    ];
                })->values(),
                'meals' => $dayMeals->map(function ($meal) {
                    return [
                        'id' => $meal->id,
                        'name' => $meal->name,
                        'consumed_at' => $meal->created_at->toISOString(),
                        'total_calories' => $meal->total_calories,
                        'meal_type' => $meal->meal_type,
                    ];
                })->values(),
                'activities' => $dayActivities->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'type' => $activity->type,
                        'duration' => $activity->duration,
                        'calories_burned' => $activity->calories_burned,
                        'performed_at' => $activity->performed_at->toISOString(),
                    ];
                })->values(),
                'total_entries' => $dayGlucose->count() + $dayMeals->count() + $dayActivities->count(),
            ];
        }

        return $calendarData;
    }
}