<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Meal extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'meal_type',
        'total_calories',
        'total_carbs',
        'total_fat',
        'total_protein',
        'eaten_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'eaten_at' => 'datetime',
        'total_calories' => 'float',
        'total_carbs' => 'float',
        'total_fat' => 'float',
        'total_protein' => 'float',
    ];

    /**
     * Get the user that owns the meal.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the meal items for the meal.
     */
    public function mealItems(): HasMany
    {
        return $this->hasMany(MealItem::class);
    }

    /**
     * Get the meal type in French.
     */
    public function getMealTypeInFrenchAttribute(): string
    {
        return match($this->meal_type) {
            'breakfast' => 'Petit déjeuner',
            'lunch' => 'Déjeuner',
            'dinner' => 'Dîner',
            'snack' => 'Collation',
            default => 'Repas'
        };
    }

    /**
     * Get the meal icon.
     */
    public function getMealIconAttribute(): string
    {
        return match($this->meal_type) {
            'breakfast' => '🍳',
            'lunch' => '🍽️',
            'dinner' => '🌙',
            'snack' => '🍎',
            default => '🍴'
        };
    }

    /**
     * Get the meal time in 24-hour format.
     */
    public function getTimeAttribute(): string
    {
        return $this->eaten_at->format('H:i');
    }

    /**
     * Get the meal date in French format.
     */
    public function getDateAttribute(): string
    {
        return $this->eaten_at->locale('fr')->isoFormat('D MMMM YYYY');
    }

    /**
     * Update the meal totals based on its items.
     */
    public function updateTotals(): void
    {
        $this->total_calories = $this->mealItems->sum('calories');
        $this->total_carbs = $this->mealItems->sum('carbs');
        $this->total_fat = $this->mealItems->sum('fat');
        $this->total_protein = $this->mealItems->sum('protein');
        $this->save();
    }

    /**
     * Scope a query to only include meals for a specific date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('eaten_at', $date);
    }

    /**
     * Scope a query to only include meals for today.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('eaten_at', today());
    }

    /**
     * Scope a query to only include meals for a specific meal type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('meal_type', $type);
    }

    /**
     * Scope a query to only include meals for a specific date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('eaten_at', [$startDate, $endDate]);
    }

    /**
     * Get the default time for a meal type.
     */
    public static function getDefaultTimeForMealType($mealType): string
    {
        return match($mealType) {
            'breakfast' => '07:30',
            'lunch' => '12:30',
            'dinner' => '19:15',
            'snack' => '16:00',
            default => now()->format('H:i')
        };
    }

    /**
     * Get the background color class for a meal type.
     */
    public function getBackgroundColorClass(): string
    {
        return match($this->meal_type) {
            'breakfast' => 'bg-blue-50',
            'lunch' => 'bg-orange-50',
            'dinner' => 'bg-purple-50',
            'snack' => 'bg-green-50',
            default => 'bg-gray-50'
        };
    }

    /**
     * Get the text color class for a meal type.
     */
    public function getTextColorClass(): string
    {
        return match($this->meal_type) {
            'breakfast' => 'text-blue-600',
            'lunch' => 'text-orange-600',
            'dinner' => 'text-purple-600',
            'snack' => 'text-green-600',
            default => 'text-gray-600'
        };
    }
}