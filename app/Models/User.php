<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the glycemia records for the user.
     */
    public function glycemiaRecords(): HasMany
    {
        return $this->hasMany(GlycemiaRecord::class);
    }

    /**
     * Get the meals for the user.
     */
    public function meals(): HasMany
    {
        return $this->hasMany(Meal::class);
    }

    /**
     * Get the activities for the user.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    /**
     * Get the user's recent glycemia records
     */
    public function recentGlycemiaRecords($limit = 10)
    {
        return $this->glycemiaRecords()
                    ->orderBy('measured_at', 'desc')
                    ->limit($limit)
                    ->get();
    }

    /**
     * Get today's glycemia records
     */
    public function todayGlycemiaRecords()
    {
        return $this->glycemiaRecords()
                    ->whereDate('measured_at', today())
                    ->orderBy('measured_at', 'desc')
                    ->get();
    }

    /**
     * Get today's meals
     */
    public function todayMeals()
    {
        return $this->meals()
                    ->whereDate('eaten_at', today())
                    ->orderBy('eaten_at')
                    ->with('mealItems')
                    ->get();
    }

    /**
     * Get today's activities
     */
    public function todayActivities()
    {
        return $this->activities()
                    ->whereDate('activity_date', today())
                    ->orderBy('activity_date')
                    ->get();
    }

    /**
     * Get meals for a specific date
     */
    public function mealsForDate($date)
    {
        return $this->meals()
                    ->whereDate('eaten_at', $date)
                    ->orderBy('eaten_at')
                    ->with('mealItems')
                    ->get();
    }

    /**
     * Get activities for a specific date
     */
    public function activitiesForDate($date)
    {
        return $this->activities()
                    ->whereDate('activity_date', $date)
                    ->orderBy('activity_date')
                    ->get();
    }

    /**
     * Get daily nutrition totals for a specific date
     */
    public function getNutritionTotalsForDate($date)
    {
        $meals = $this->mealsForDate($date);
        
        return [
            'calories' => $meals->sum('total_calories'),
            'carbs' => $meals->sum('total_carbs'),
            'protein' => $meals->sum('total_protein'),
            'fat' => $meals->sum('total_fat'),
        ];
    }

    /**
     * Get daily activity totals for a specific date
     */
    public function getActivityTotalsForDate($date)
    {
        $activities = $this->activitiesForDate($date);
        
        return [
            'total_duration' => $activities->sum('duration_minutes'),
            'total_calories' => $activities->sum('burned_calories'),
            'activity_count' => $activities->count(),
            'average_intensity' => $activities->avg('intensity'),
        ];
    }

    /**
     * Get glycemia statistics for the user
     */
    public function getGlycemiaStatistics()
    {
        $records = $this->glycemiaRecords;
        
        if ($records->isEmpty()) {
            return [
                'total_records' => 0,
                'average' => null,
                'normal_percentage' => 0,
                'high_count' => 0,
                'low_count' => 0,
            ];
        }

        return [
            'total_records' => $records->count(),
            'average' => round($records->avg('value'), 1),
            'normal_percentage' => round(($records->where('status', 'normal')->count() / $records->count()) * 100, 1),
            'high_count' => $records->where('status', 'high')->count(),
            'low_count' => $records->where('status', 'low')->count(),
            'latest_reading' => $records->sortByDesc('measured_at')->first(),
        ];
    }

    /**
     * Get nutrition statistics for the user
     */
    public function getNutritionStatistics($days = 7)
    {
        $startDate = Carbon::today()->subDays($days - 1);
        $endDate = Carbon::today();
        
        $meals = $this->meals()
                      ->whereBetween('eaten_at', [$startDate, $endDate])
                      ->get();
        
        if ($meals->isEmpty()) {
            return [
                'total_meals' => 0,
                'average_calories' => null,
                'average_carbs' => null,
                'average_protein' => null,
                'average_fat' => null,
            ];
        }
        
        // Group meals by date
        $mealsByDate = $meals->groupBy(function ($meal) {
            return Carbon::parse($meal->eaten_at)->format('Y-m-d');
        });
        
        // Calculate daily averages
        $dailyTotals = $mealsByDate->map(function ($dayMeals) {
            return [
                'calories' => $dayMeals->sum('total_calories'),
                'carbs' => $dayMeals->sum('total_carbs'),
                'protein' => $dayMeals->sum('total_protein'),
                'fat' => $dayMeals->sum('total_fat'),
            ];
        });
        
        return [
            'total_meals' => $meals->count(),
            'average_calories' => round($dailyTotals->avg('calories'), 1),
            'average_carbs' => round($dailyTotals->avg('carbs'), 1),
            'average_protein' => round($dailyTotals->avg('protein'), 1),
            'average_fat' => round($dailyTotals->avg('fat'), 1),
            'meal_type_distribution' => [
                'breakfast' => $meals->where('meal_type', 'breakfast')->count(),
                'lunch' => $meals->where('meal_type', 'lunch')->count(),
                'dinner' => $meals->where('meal_type', 'dinner')->count(),
                'snack' => $meals->where('meal_type', 'snack')->count(),
            ],
        ];
    }

    /**
     * Get activity statistics for the user
     */
    public function getActivityStatistics($days = 7)
    {
        $startDate = Carbon::today()->subDays($days - 1);
        $endDate = Carbon::today();
        
        $activities = $this->activities()
                          ->whereBetween('activity_date', [$startDate, $endDate])
                          ->get();
        
        if ($activities->isEmpty()) {
            return [
                'total_activities' => 0,
                'total_duration' => 0,
                'total_calories' => 0,
                'average_duration' => null,
                'most_common_activity' => null,
            ];
        }
        
        return [
            'total_activities' => $activities->count(),
            'total_duration' => $activities->sum('duration_minutes'),
            'total_calories' => $activities->sum('burned_calories'),
            'average_duration' => round($activities->avg('duration_minutes'), 1),
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
            'activity_type_distribution' => $activities->groupBy('activity_type')
                ->map->count()
                ->sortDesc()
                ->take(5),
        ];
    }

    /**
     * Get weekly activity goal progress
     */
    public function getWeeklyActivityProgress()
    {
        $weeklyGoal = 150; // WHO recommendation: 150 minutes per week
        $thisWeekActivities = $this->activities()
            ->whereBetween('activity_date', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])
            ->get();
            
        $weeklyTotal = $thisWeekActivities->sum('duration_minutes');
        
        return [
            'goal' => $weeklyGoal,
            'achieved' => $weeklyTotal,
            'percentage' => min(100, round(($weeklyTotal / $weeklyGoal) * 100)),
            'remaining' => max(0, $weeklyGoal - $weeklyTotal),
            'on_track' => $weeklyTotal >= ($weeklyGoal * (now()->dayOfWeek / 7)),
        ];
    }
}