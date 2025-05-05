<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = ['user_id', 'goal_type', 'target_value', 'unit', 'current_value', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}