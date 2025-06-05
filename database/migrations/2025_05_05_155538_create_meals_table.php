<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);
            $table->float('total_calories')->nullable();
            $table->float('total_carbs')->nullable();
            $table->float('total_fat')->nullable();
            $table->float('total_protein')->nullable();
            $table->timestamp('eaten_at');
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index(['user_id', 'eaten_at']);
            $table->index(['user_id', 'meal_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};