<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = ['user_id', 'activity_type', 'duration_minutes', 'intensity', 'burned_calories', 'activity_date'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}