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
        Schema::create('glycemia_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->float('value', 4, 1); // More precise for glycemia values
            $table->timestamp('measured_at');
            $table->enum('status', ['normal', 'high', 'low']);
            $table->text('note')->nullable();
            $table->timestamps();

            // Add indexes for better performance
            $table->index(['user_id', 'measured_at']);
            $table->index(['user_id', 'status']);
            $table->index('measured_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('glycemia_records');
    }
};