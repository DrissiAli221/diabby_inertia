<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Activity extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'activity_type',
        'duration_minutes',
        'intensity',
        'burned_calories',
        'activity_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'activity_date' => 'datetime',
        'duration_minutes' => 'integer',
        'burned_calories' => 'float',
    ];

    /**
     * Get the user that owns the activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the activity type in French.
     */
    public function getActivityTypeInFrenchAttribute(): string
    {
        return match($this->activity_type) {
            'walking' => 'Marche',
            'running' => 'Course à pied',
            'cycling' => 'Vélo',
            'swimming' => 'Natation',
            'strength_training' => 'Exercices de renforcement',
            'yoga' => 'Yoga',
            'hiking' => 'Randonnée',
            'dancing' => 'Danse',
            'tennis' => 'Tennis',
            'football' => 'Football',
            'basketball' => 'Basketball',
            'gym' => 'Salle de sport',
            default => ucfirst($this->activity_type)
        };
    }

    /**
     * Get the intensity in French.
     */
    public function getIntensityInFrenchAttribute(): string
    {
        return match($this->intensity) {
            'low' => 'Intensité légère',
            'moderate' => 'Intensité modérée',
            'high' => 'Intensité élevée',
            default => 'Intensité modérée'
        };
    }

    /**
     * Get the activity icon.
     */
    public function getActivityIconAttribute(): string
    {
        return match($this->activity_type) {
            'walking' => '🚶',
            'running' => '🏃',
            'cycling' => '🚴',
            'swimming' => '🏊',
            'strength_training' => '🏋️',
            'yoga' => '🧘',
            'hiking' => '🥾',
            'dancing' => '💃',
            'tennis' => '🎾',
            'football' => '⚽',
            'basketball' => '🏀',
            'gym' => '💪',
            default => '🏃'
        };
    }

    /**
     * Get the activity color class.
     */
    public function getActivityColorAttribute(): string
    {
        return match($this->activity_type) {
            'walking' => 'bg-green-100 text-green-800',
            'running' => 'bg-red-100 text-red-800',
            'cycling' => 'bg-blue-100 text-blue-800',
            'swimming' => 'bg-cyan-100 text-cyan-800',
            'strength_training' => 'bg-purple-100 text-purple-800',
            'yoga' => 'bg-pink-100 text-pink-800',
            'hiking' => 'bg-orange-100 text-orange-800',
            'dancing' => 'bg-yellow-100 text-yellow-800',
            'tennis' => 'bg-lime-100 text-lime-800',
            'football' => 'bg-emerald-100 text-emerald-800',
            'basketball' => 'bg-amber-100 text-amber-800',
            'gym' => 'bg-indigo-100 text-indigo-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    /**
     * Get the intensity color class.
     */
    public function getIntensityColorAttribute(): string
    {
        return match($this->intensity) {
            'low' => 'text-green-600',
            'moderate' => 'text-orange-600',
            'high' => 'text-red-600',
            default => 'text-gray-600'
        };
    }

    /**
     * Get the activity time in 24-hour format.
     */
    public function getTimeAttribute(): string
    {
        return $this->activity_date->format('H:i');
    }

    /**
     * Get the activity date in French format.
     */
    public function getDateAttribute(): string
    {
        return $this->activity_date->locale('fr')->isoFormat('D MMMM YYYY');
    }

    /**
     * Get the formatted duration.
     */
    public function getFormattedDurationAttribute(): string
    {
        if ($this->duration_minutes < 60) {
            return $this->duration_minutes . ' minutes';
        }
        
        $hours = floor($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;
        
        if ($minutes === 0) {
            return $hours . 'h';
        }
        
        return $hours . 'h' . $minutes . 'min';
    }

    /**
     * Get the formatted calories.
     */
    public function getFormattedCaloriesAttribute(): string
    {
        return round($this->burned_calories) . ' calories';
    }

    /**
     * Calculate estimated glycemia impact.
     */
    public function getEstimatedGlycemiaImpactAttribute(): float
    {
        // Simple calculation based on duration and intensity
        $baseImpact = $this->duration_minutes * 0.01; // Base impact per minute
        
        $intensityMultiplier = match($this->intensity) {
            'low' => 0.5,
            'moderate' => 1.0,
            'high' => 1.5,
            default => 1.0
        };
        
        return round($baseImpact * $intensityMultiplier, 1);
    }

    /**
     * Get motivational message based on activity.
     */
    public function getMotivationalMessageAttribute(): string
    {
        $messages = [
            'walking' => "Belle marche matinale ! Continuez à ce rythme 💪",
            'running' => "Course excellente ! Votre endurance s'améliore 🏃‍♂️",
            'cycling' => "Session intense ! Votre fréquence cardiaque était dans la zone idéale 🚴‍♂️",
            'swimming' => "La natation est excellente pour les articulations et le contrôle glycémique 🏊‍♂️",
            'strength_training' => "Le renforcement musculaire améliore votre sensibilité à l'insuline 💪",
            'yoga' => "Excellente séance de relaxation et d'étirement 🧘‍♀️",
            'hiking' => "La nature et l'exercice, un duo gagnant pour votre santé ! 🥾",
            'dancing' => "Danser est un excellent moyen de rester actif et joyeux ! 💃",
            'tennis' => "Sport complet qui améliore coordination et endurance 🎾",
            'football' => "Sport d'équipe excellent pour le cardio 🏈",
            'basketball' => "Excellent pour l'agilité et l'endurance 🏀",
            'gym' => "Séance complète en salle ! Bravo pour votre régularité 🏋️‍♂️",
        ];
        
        return $messages[$this->activity_type] ?? "Excellente activité ! Continuez ainsi 👏";
    }

    /**
     * Scope a query to only include activities for a specific date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('activity_date', $date);
    }

    /**
     * Scope a query to only include activities for today.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('activity_date', today());
    }

    /**
     * Scope a query to only include activities for this week.
     */
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('activity_date', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    /**
     * Scope a query to only include activities for this month.
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('activity_date', now()->month)
                    ->whereYear('activity_date', now()->year);
    }

    /**
     * Scope a query to only include activities of a specific type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('activity_type', $type);
    }

    /**
     * Scope a query to only include activities with a specific intensity.
     */
    public function scopeWithIntensity($query, $intensity)
    {
        return $query->where('intensity', $intensity);
    }

    /**
     * Scope a query to only include activities for a specific date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('activity_date', [$startDate, $endDate]);
    }

    /**
     * Get recent activities.
     */
    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('activity_date', 'desc')->limit($limit);
    }

    /**
     * Calculate MET (Metabolic Equivalent of Task) value.
     */
    public function getMetValueAttribute(): float
    {
        $metValues = [
            'walking' => ['low' => 2.5, 'moderate' => 3.5, 'high' => 4.5],
            'running' => ['low' => 6.0, 'moderate' => 8.0, 'high' => 11.0],
            'cycling' => ['low' => 4.0, 'moderate' => 6.8, 'high' => 10.0],
            'swimming' => ['low' => 4.0, 'moderate' => 6.0, 'high' => 8.0],
            'strength_training' => ['low' => 3.0, 'moderate' => 5.0, 'high' => 6.0],
            'yoga' => ['low' => 2.0, 'moderate' => 3.0, 'high' => 4.0],
            'hiking' => ['low' => 4.0, 'moderate' => 6.0, 'high' => 8.0],
            'dancing' => ['low' => 3.0, 'moderate' => 4.8, 'high' => 7.0],
            'tennis' => ['low' => 5.0, 'moderate' => 7.0, 'high' => 8.0],
            'football' => ['low' => 6.0, 'moderate' => 8.0, 'high' => 10.0],
            'basketball' => ['low' => 6.0, 'moderate' => 8.0, 'high' => 10.0],
            'gym' => ['low' => 3.0, 'moderate' => 5.0, 'high' => 6.0],
        ];
        
        return $metValues[$this->activity_type][$this->intensity] ?? 4.0;
    }

    /**
     * Check if activity is cardio-based.
     */
    public function isCardio(): bool
    {
        $cardioActivities = ['walking', 'running', 'cycling', 'swimming', 'dancing', 'hiking'];
        return in_array($this->activity_type, $cardioActivities);
    }

    /**
     * Check if activity is strength-based.
     */
    public function isStrength(): bool
    {
        $strengthActivities = ['strength_training', 'gym'];
        return in_array($this->activity_type, $strengthActivities);
    }

    /**
     * Check if activity is flexibility-based.
     */
    public function isFlexibility(): bool
    {
        $flexibilityActivities = ['yoga'];
        return in_array($this->activity_type, $flexibilityActivities);
    }
}