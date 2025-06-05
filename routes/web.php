<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GlycemiaController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\MealItemController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CalendarController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public welcome page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Static pages
Route::get('/resources', fn() => Inertia::render('Resources'))->name('resources');
Route::get('/tracking', fn() => Inertia::render('Tracking'))->name('tracking');
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/contact', fn() => Inertia::render('Contact'))->name('contact');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Calendar
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');
    
    // Glycemia routes (using explicit and resourceful combined)
    Route::get('/glycemia', [GlycemiaController::class, 'index'])->name('glycemia.index');
    Route::post('/glycemia', [GlycemiaController::class, 'store'])->name('glycemia.store');
    Route::delete('/glycemia/{glycemiaRecord}', [GlycemiaController::class, 'destroy'])->name('glycemia.destroy');
    
    // API endpoints for glycemia charts/statistics
    Route::get('/api/glycemia/chart-data', [GlycemiaController::class, 'chartData'])->name('glycemia.chart-data');
    Route::get('/api/glycemia/statistics', [GlycemiaController::class, 'statistics'])->name('glycemia.statistics');

    // Nutrition routes
    Route::get('/nutrition', [MealController::class, 'index'])->name('nutrition.index');
    Route::get('/nutrition/create', [MealController::class, 'create'])->name('nutrition.create');
    Route::post('/nutrition/meals', [MealController::class, 'store'])->name('meals.store');
    Route::put('/nutrition/meals/{meal}', [MealController::class, 'update'])->name('meals.update');
    Route::delete('/nutrition/meals/{meal}', [MealController::class, 'destroy'])->name('meals.destroy');
    
    // Meal items routes
    Route::post('/nutrition/meals/{meal}/items', [MealItemController::class, 'store'])->name('meal-items.store');
    Route::put('/nutrition/meal-items/{mealItem}', [MealItemController::class, 'update'])->name('meal-items.update');
    Route::delete('/nutrition/meal-items/{mealItem}', [MealItemController::class, 'destroy'])->name('meal-items.destroy');
    
    // Food database search and nutrition info
    Route::get('/nutrition/foods/search', [MealItemController::class, 'search'])->name('foods.search');
    Route::get('/nutrition/foods/nutrition', [MealItemController::class, 'getNutrition'])->name('foods.nutrition');
    
    // Nutrition statistics API
    Route::get('/api/nutrition/statistics', [MealController::class, 'statistics'])->name('nutrition.statistics');
    
    // Activity routes
    Route::get('/activity', [ActivityController::class, 'index'])->name('activity.index');
    Route::post('/activity', [ActivityController::class, 'store'])->name('activity.store');
    Route::put('/activity/{activity}', [ActivityController::class, 'update'])->name('activity.update');
    Route::delete('/activity/{activity}', [ActivityController::class, 'destroy'])->name('activity.destroy');
    
    // Activity statistics API
    Route::get('/api/activity/statistics', [ActivityController::class, 'statistics'])->name('activity.statistics');
    
    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';