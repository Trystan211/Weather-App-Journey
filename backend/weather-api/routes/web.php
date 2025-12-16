<?php

use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\JourneyController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Weather/Index');
})->name('weather.home');

Route::get('/dashboard', function () {
    $user = auth()->user();
    $favorites = $user->favorites()->get();
    
    return Inertia::render('Dashboard', [
        'stats' => [
            'favorites_count' => $favorites->count(),
            'recent_favorites' => $favorites->take(5)->map(fn($f) => [
                'id' => $f->id,
                'title' => $f->title,
                'api_id' => $f->api_id,
                'created_at' => $f->created_at->diffForHumans(),
            ]),
        ],
        'user' => [
            'name' => $user->name,
            'member_since' => $user->created_at->format('F Y'),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.page');
    Route::post('/favorites', [FavoriteController::class, 'store'])->name('favorites.store');
    Route::delete('/favorites/{favorite}', [FavoriteController::class, 'destroy'])->name('favorites.destroy');
    Route::get('/journey', JourneyController::class)->name('journey.page');
});

require __DIR__.'/auth.php';
