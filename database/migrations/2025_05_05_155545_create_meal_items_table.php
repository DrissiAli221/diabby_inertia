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
        Schema::create('meal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->float('calories');
            $table->float('carbs');
            $table->float('fat');
            $table->float('protein');
            $table->float('quantity')->nullable();
            $table->string('unit', 50)->nullable();
            $table->string('portion_description')->nullable();
            $table->timestamps();
            
            // Add index for better performance
            $table->index('meal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_items');
    }
};