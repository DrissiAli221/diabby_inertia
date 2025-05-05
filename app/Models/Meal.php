<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    protected $fillable = [
        'user_id', 'meal_type', 'total_calories', 'total_carbs', 'total_fat', 'total_protein', 'eaten_at'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function items() {
        return $this->hasMany(MealItem::class);
    }
}