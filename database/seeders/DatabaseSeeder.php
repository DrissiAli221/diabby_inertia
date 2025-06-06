<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // // Create the test user
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Call both seeders for drissiali2004@gmail.com
        $this->call([
            MealSeeder::class,
            ActivitySeeder::class,
            GlycemiaRecordSeeder::class,
        ]);
    }
}