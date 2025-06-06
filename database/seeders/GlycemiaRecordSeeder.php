<?php

namespace Database\Seeders;

use App\Models\GlycemiaRecord;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class GlycemiaRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Retrieve or create the user
        $user = User::firstOrCreate(
            ['email' => 'drissiali2004@gmail.com'],
            ['name' => 'Drissi Ali']
        );

        // Generate realistic glycemia records
        $this->createRealisticGlycemiaRecords($user);
    }

    /**
     * Create realistic glycemia records for a user
     */
    private function createRealisticGlycemiaRecords(User $user): void
    {
        $now = Carbon::now();

        // Generate records for the past 30 days
        for ($dayOffset = 30; $dayOffset >= 0; $dayOffset--) {
            $date = $now->copy()->subDays($dayOffset);

            // Skip some days randomly (simulate real life inconsistency)
            if (rand(1, 100) <= 15) { // 15% chance to skip a day
                continue;
            }

            // Determine number of measurements per day (1-4 measurements)
            $measurementsPerDay = $this->getMeasurementsCountForDay();

            foreach ($measurementsPerDay as $timeSlot) {
                $this->createGlycemiaRecord($user, $date, $timeSlot);
            }
        }

        // Add today's measurements if it's not already included
        if (rand(1, 100) <= 80) { // 80% chance to have today's reading
            $todayMeasurements = $this->getMeasurementsCountForDay();
            foreach ($todayMeasurements as $timeSlot) {
                $this->createGlycemiaRecord($user, $now, $timeSlot);
            }
        }
    }

    /**
     * Get random number and times of measurements for a day
     */
    private function getMeasurementsCountForDay(): array
    {
        $possibleSlots = ['fasting', 'before_lunch', 'after_lunch', 'before_dinner', 'after_dinner', 'bedtime'];
        
        // Most common patterns
        $patterns = [
            ['fasting'], // 30% - just morning reading
            ['fasting', 'after_lunch'], // 25% - morning and post-lunch
            ['fasting', 'before_dinner'], // 20% - morning and before dinner
            ['fasting', 'after_lunch', 'before_dinner'], // 15% - three readings
            ['fasting', 'after_lunch', 'after_dinner'], // 10% - morning, post-lunch, post-dinner
        ];

        $weights = [30, 25, 20, 15, 10];
        $selectedPattern = $this->weightedRandom($patterns, $weights);

        return $selectedPattern;
    }

    /**
     * Create a glycemia record for a specific time slot
     */
    private function createGlycemiaRecord(User $user, Carbon $date, string $timeSlot): void
    {
        $timeRanges = [
            'fasting' => ['start' => 6, 'end' => 8], // 6:00-8:00 AM
            'before_lunch' => ['start' => 11, 'end' => 12], // 11:00-12:00 PM
            'after_lunch' => ['start' => 13, 'end' => 15], // 1:00-3:00 PM
            'before_dinner' => ['start' => 17, 'end' => 19], // 5:00-7:00 PM
            'after_dinner' => ['start' => 20, 'end' => 22], // 8:00-10:00 PM
            'bedtime' => ['start' => 22, 'end' => 23], // 10:00-11:00 PM
        ];

        $timeRange = $timeRanges[$timeSlot];
        $hour = rand($timeRange['start'], $timeRange['end']);
        $minute = rand(0, 59);

        $measurementTime = $date->copy()->setTime($hour, $minute);

        // Generate realistic glucose values based on time slot
        $value = $this->generateGlucoseValue($timeSlot);
        
        // Determine status based on value
        $status = $this->determineStatus($value);

        // Generate occasional notes
        $note = $this->generateNote($status, $timeSlot);

        GlycemiaRecord::create([
            'user_id' => $user->id,
            'value' => $value,
            'measured_at' => $measurementTime,
            'status' => $status,
            'note' => $note,
        ]);
    }

    /**
     * Generate realistic glucose values based on time of measurement
     */
    private function generateGlucoseValue(string $timeSlot): float
    {
        // Realistic glucose ranges in mmol/L
        $ranges = [
            'fasting' => ['min' => 3.8, 'max' => 6.2, 'normal_min' => 4.0, 'normal_max' => 5.6],
            'before_lunch' => ['min' => 3.9, 'max' => 7.0, 'normal_min' => 4.0, 'normal_max' => 6.5],
            'after_lunch' => ['min' => 4.2, 'max' => 9.5, 'normal_min' => 4.5, 'normal_max' => 8.0],
            'before_dinner' => ['min' => 3.8, 'max' => 7.2, 'normal_min' => 4.0, 'normal_max' => 6.8],
            'after_dinner' => ['min' => 4.0, 'max' => 9.8, 'normal_min' => 4.5, 'normal_max' => 8.2],
            'bedtime' => ['min' => 3.6, 'max' => 8.0, 'normal_min' => 4.0, 'normal_max' => 7.0],
        ];

        $range = $ranges[$timeSlot];

        // 70% chance of normal values, 20% high, 10% low
        $rand = rand(1, 100);

        if ($rand <= 70) {
            // Normal range
            $value = $this->randomFloat($range['normal_min'], $range['normal_max']);
        } elseif ($rand <= 90) {
            // High range
            $value = $this->randomFloat($range['normal_max'], $range['max']);
        } else {
            // Low range
            $value = $this->randomFloat($range['min'], $range['normal_min']);
        }

        return round($value, 1);
    }

    /**
     * Determine status based on glucose value (mmol/L)
     */
    private function determineStatus(float $value): string
    {
        if ($value < 4.0) {
            return 'low';
        } elseif ($value > 7.0) {
            return 'high';
        }
        return 'normal';
    }

    /**
     * Generate occasional notes for measurements
     */
    private function generateNote(string $status, string $timeSlot): ?string
    {
        // Only add notes 20% of the time
        if (rand(1, 100) > 20) {
            return null;
        }

        $notes = [
            'normal' => [
                'Feeling good today',
                'Regular measurement',
                'After light exercise',
                'Normal day',
                'Good sleep last night',
            ],
            'high' => [
                'Ate too much at lunch',
                'Stressful day at work',
                'Forgot medication this morning',
                'Had dessert with dinner',
                'Feeling a bit tired',
                'Need to drink more water',
            ],
            'low' => [
                'Skipped breakfast',
                'Long workout this morning',
                'Feeling a bit dizzy',
                'Need to eat something',
                'Had light meal',
            ]
        ];

        $statusNotes = $notes[$status] ?? $notes['normal'];
        return $statusNotes[array_rand($statusNotes)];
    }

    /**
     * Generate random float between min and max
     */
    private function randomFloat(float $min, float $max): float
    {
        return $min + mt_rand() / mt_getrandmax() * ($max - $min);
    }

    /**
     * Weighted random selection
     */
    private function weightedRandom(array $options, array $weights): mixed
    {
        $totalWeight = array_sum($weights);
        $random = rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($options as $index => $option) {
            $currentWeight += $weights[$index];
            if ($random <= $currentWeight) {
                return $option;
            }
        }
        
        return $options[0]; // fallback
    }
}