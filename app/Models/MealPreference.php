<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealPreference extends Model
{
    protected $fillable = ['user_id', 'meal_item_id', 'preference'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mealItem()
    {
        return $this->belongsTo(MealItem::class);
    }
}
