<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'meal_id',
        'name',
        'calories',
        'carbs',
        'fat',
        'protein',
        'quantity',
        'unit',
        'portion_description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'calories' => 'float',
        'carbs' => 'float',
        'fat' => 'float',
        'protein' => 'float',
        'quantity' => 'float',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::created(function ($mealItem) {
            $mealItem->meal->updateTotals();
        });

        static::updated(function ($mealItem) {
            $mealItem->meal->updateTotals();
        });

        static::deleted(function ($mealItem) {
            $mealItem->meal->updateTotals();
        });
    }

    /**
     * Get the meal that owns the meal item.
     */
    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class);
    }

    /**
     * Get the formatted portion description.
     */
    public function getPortionDescriptionAttribute(): string
    {
        if ($this->attributes['portion_description'] ?? null) {
            return $this->attributes['portion_description'];
        }

        if (isset($this->attributes['quantity']) && isset($this->attributes['unit'])) {
            return "{$this->attributes['quantity']} {$this->attributes['unit']}";
        }

        return '';
    }

    /**
     * Get the color for the food category.
     */
    public function getFoodCategoryColor(): string
    {
        // Simple categorization based on name
        $name = strtolower($this->name);
        
        if (str_contains($name, 'pain') || str_contains($name, 'céréale') || str_contains($name, 'pâte')) {
            return 'blue'; // Carbs
        } elseif (str_contains($name, 'viande') || str_contains($name, 'poisson') || str_contains($name, 'œuf') || str_contains($name, 'oeuf')) {
            return 'orange'; // Proteins
        } elseif (str_contains($name, 'légume') || str_contains($name, 'salade') || str_contains($name, 'fruit')) {
            return 'green'; // Fruits/Vegetables
        } elseif (str_contains($name, 'fromage') || str_contains($name, 'beurre') || str_contains($name, 'huile')) {
            return 'yellow'; // Dairy/Fats
        } else {
            return 'red'; // Other
        }
    }

    /**
     * Get the icon for the food category.
     */
    public function getFoodCategoryIcon(): string
    {
        $category = $this->getFoodCategoryColor();
        
        return match($category) {
            'blue' => '🍞', // Carbs
            'orange' => '🥩', // Proteins
            'green' => '🥗', // Fruits/Vegetables
            'yellow' => '🧀', // Dairy/Fats
            'red' => '🍫', // Other
            default => '🍴'
        };
    }

    /**
     * Get the glycemic impact of the food item.
     */
    public function getGlycemicImpact(): string
    {
        // Simple calculation based on carbs and fiber (not stored in our model)
        if ($this->carbs < 5) {
            return 'Très faible';
        } elseif ($this->carbs < 15) {
            return 'Faible';
        } elseif ($this->carbs < 30) {
            return 'Modéré';
        } else {
            return 'Élevé';
        }
    }

    /**
     * Get the formatted calories.
     */
    public function getFormattedCaloriesAttribute(): string
    {
        return round($this->calories) . ' cal';
    }

    /**
     * Get the formatted carbs.
     */
    public function getFormattedCarbsAttribute(): string
    {
        return round($this->carbs) . 'g glucides';
    }
}