<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class GlycemiaRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'value',
        'measured_at',
        'status',
        'note',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'measured_at' => 'datetime',
        'value' => 'float',
    ];

    /**
     * Get the user that owns the glycemia record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the status label in French
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'high' => 'Élevé',
            'low' => 'Bas',
            'normal' => 'Normal',
            default => 'Normal'
        };
    }

    /**
     * Get the context based on measurement time
     */
    public function getContextAttribute(): string
    {
        $hour = $this->measured_at->hour;
        
        if ($hour >= 6 && $hour < 9) {
            return 'À jeun';
        } elseif ($hour >= 9 && $hour < 12) {
            return 'Avant déjeuner';
        } elseif ($hour >= 12 && $hour < 15) {
            return 'Après déjeuner';
        } elseif ($hour >= 15 && $hour < 19) {
            return 'Avant dîner';
        } elseif ($hour >= 19 && $hour < 22) {
            return 'Après dîner';
        } else {
            return 'Coucher';
        }
    }

    /**
     * Get formatted value with unit
     */
    public function getFormattedValueAttribute(): string
    {
        return $this->value . ' mmol/L';
    }

    /**
     * Scope to get records for today
     */
    public function scopeToday($query)
    {
        return $query->whereDate('measured_at', today());
    }

    /**
     * Scope to get records for a specific date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('measured_at', [$startDate, $endDate]);
    }

    /**
     * Scope to filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get records for current week
     */
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('measured_at', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    /**
     * Scope to get records for current month
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('measured_at', now()->month)
                    ->whereYear('measured_at', now()->year);
    }

    /**
     * Scope to get recent records
     */
    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('measured_at', 'desc')->limit($limit);
    }

    /**
     * Check if the reading is within normal range
     */
    public function isNormal(): bool
    {
        return $this->status === 'normal';
    }

    /**
     * Check if the reading is high
     */
    public function isHigh(): bool
    {
        return $this->status === 'high';
    }

    /**
     * Check if the reading is low
     */
    public function isLow(): bool
    {
        return $this->status === 'low';
    }
}