<?php

use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\WeatherController;
use Illuminate\Support\Facades\Route;

Route::get('/weather', [WeatherController::class, 'getWeather']);

Route::middleware('auth')->group(function () {
    Route::apiResource('favorites', FavoriteController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names([
            'index' => 'api.favorites.index',
            'store' => 'api.favorites.store',
            'update' => 'api.favorites.update',
            'destroy' => 'api.favorites.destroy',
        ]);
});
