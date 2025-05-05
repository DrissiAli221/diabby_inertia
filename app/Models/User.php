<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
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

    // 🔽 Add these relationships below

    public function glycemiaRecords()
    {
        return $this->hasMany(GlycemiaRecord::class);
    }

    public function meals()
    {
        return $this->hasMany(Meal::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function mealPreferences()
    {
        return $this->hasMany(MealPreference::class);
    }
}