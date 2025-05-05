<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlycemiaRecord extends Model
{
    protected $fillable = ['user_id', 'value', 'measured_at', 'status', 'note'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}