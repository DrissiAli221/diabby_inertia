<?php

use App\Http\Controllers\GlycemiaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Glycemia API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('glycemia')->group(function () {
        Route::get('/chart-data', [GlycemiaController::class, 'chartData']);
        Route::get('/statistics', [GlycemiaController::class, 'statistics']);
        Route::get('/export', [GlycemiaController::class, 'export']);
    });
});