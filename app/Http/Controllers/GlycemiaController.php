<?php

namespace App\Http\Controllers;

use App\Models\GlycemiaRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class GlycemiaController extends Controller
{
    /**
     * Display a listing of the user's glycemia records.
     */
    public function index(): Response
    {
        $glycemiaRecords = Auth::user()
            ->glycemiaRecords()
            ->orderBy('measured_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'date' => Carbon::parse($record->measured_at)->format('d M Y'),
                    'time' => Carbon::parse($record->measured_at)->format('H:i'),
                    'value' => $record->value . ' mmol/L',
                    'context' => $this->getContextFromTime($record->measured_at),
                    'status' => $this->getStatusLabel($record->status),
                    'notes' => $record->note,
                    'raw_value' => $record->value,
                    'raw_status' => $record->status,
                    'measured_at' => $record->measured_at,
                ];
            });

        $currentReading = $glycemiaRecords->first();
        
        // Get today's readings for statistics
        $todayReadings = Auth::user()
            ->glycemiaRecords()
            ->whereDate('measured_at', today())
            ->get();
            
        $dailyAverage = $todayReadings->avg('value');

        return Inertia::render('Glycemia/Index', [
            'glycemiaRecords' => $glycemiaRecords,
            'currentReading' => $currentReading,
            'dailyAverage' => $dailyAverage ? round($dailyAverage, 1) : null,
            'todayCount' => $todayReadings->count(),
            'statusOptions' => ['normal', 'high', 'low'],
        ]);
    }

    /**
     * Store a newly created glycemia record in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'value' => 'required|numeric|min:0|max:30',
            'measured_at' => 'required|date',
            'note' => 'nullable|string|max:1000',
        ]);

        // Determine status based on value (assuming mmol/L)
        $status = $this->determineStatus($validated['value']);

        // Associate the record with the authenticated user
        Auth::user()->glycemiaRecords()->create([
            'value' => $validated['value'],
            'measured_at' => $validated['measured_at'],
            'status' => $status,
            'note' => $validated['note'],
        ]);

        return redirect()->route('glycemia.index')->with('success', 'Mesure de glycémie enregistrée avec succès.');
    }

    /**
     * Remove the specified glycemia record from storage.
     */
    public function destroy(GlycemiaRecord $glycemiaRecord)
    {
        // Ensure the record belongs to the authenticated user
        if ($glycemiaRecord->user_id !== Auth::id()) {
            abort(403);
        }

        $glycemiaRecord->delete();

        return redirect()->route('glycemia.index')->with('success', 'Mesure supprimée avec succès.');
    }

    /**
     * Get records for chart data
     */
    public function chartData(Request $request)
    {
        $period = $request->get('period', 'week'); // day, week, month
        
        $query = Auth::user()->glycemiaRecords();
        
        switch ($period) {
            case 'day':
                $query->whereDate('measured_at', today());
                break;
            case 'week':
                $query->whereBetween('measured_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'month':
                $query->whereMonth('measured_at', now()->month)
                      ->whereYear('measured_at', now()->year);
                break;
        }
        
        $records = $query->orderBy('measured_at', 'asc')->get();
        
        return response()->json([
            'data' => $records->map(function ($record) {
                return [
                    'time' => Carbon::parse($record->measured_at)->format('H:i'),
                    'date' => Carbon::parse($record->measured_at)->format('d/m'),
                    'value' => $record->value,
                    'status' => $record->status,
                ];
            })
        ]);
    }

    /**
     * Get statistics for dashboard
     */
    public function statistics()
    {
        $user = Auth::user();
        
        // Today's statistics
        $todayRecords = $user->glycemiaRecords()->whereDate('measured_at', today())->get();
        $weekRecords = $user->glycemiaRecords()
            ->whereBetween('measured_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->get();
        $monthRecords = $user->glycemiaRecords()
            ->whereMonth('measured_at', now()->month)
            ->whereYear('measured_at', now()->year)
            ->get();
            
        return response()->json([
            'today' => [
                'count' => $todayRecords->count(),
                'average' => $todayRecords->avg('value') ? round($todayRecords->avg('value'), 1) : null,
                'min' => $todayRecords->min('value'),
                'max' => $todayRecords->max('value'),
            ],
            'week' => [
                'count' => $weekRecords->count(),
                'average' => $weekRecords->avg('value') ? round($weekRecords->avg('value'), 1) : null,
                'in_range' => $weekRecords->where('status', 'normal')->count(),
            ],
            'month' => [
                'count' => $monthRecords->count(),
                'average' => $monthRecords->avg('value') ? round($monthRecords->avg('value'), 1) : null,
                'high_count' => $monthRecords->where('status', 'high')->count(),
                'low_count' => $monthRecords->where('status', 'low')->count(),
            ]
        ]);
    }

    /**
     * Determine status based on glucose value (mmol/L)
     */
    private function determineStatus($value): string
    {
        if ($value < 4.0) {
            return 'low';
        } elseif ($value > 7.0) {
            return 'high';
        }
        return 'normal';
    }

    /**
     * Get status label in French
     */
    private function getStatusLabel($status): string
    {
        return match($status) {
            'high' => 'Élevé',
            'low' => 'Bas',
            'normal' => 'Normal',
            default => 'Normal'
        };
    }

    /**
     * Get context based on time of measurement
     */
    private function getContextFromTime($measuredAt): string
    {
        $hour = Carbon::parse($measuredAt)->hour;
        
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
}