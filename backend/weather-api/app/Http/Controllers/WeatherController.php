<?php

namespace App\Http\Controllers;

use App\Services\WeatherStoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    public function __construct(private WeatherStoryService $weatherService) {}

    public function getWeather(Request $request)
    {
        $city = trim((string) $request->query('city', ''));

        if ($city === '') {
            return response()->json(['error' => 'City is required'], 400);
        }

        $cacheMinutes = (int) $request->integer('cache_minutes', 5);
        $cacheMinutes = max(1, min($cacheMinutes, 30));
        $cacheKey = sprintf('weather:story:%s:%d', strtolower($city), $cacheMinutes);

        $story = Cache::remember($cacheKey, now()->addMinutes($cacheMinutes), function () use ($city) {
            return $this->weatherService->getWeatherStory($city);
        });

        if (! $story && $request->boolean('example')) {
            $story = $this->examplePayload($city);
        }

        if (! $story) {
            return response()->json(['error' => 'API unavailable'], 503);
        }

        return response()->json(
            array_merge($story, [
                'meta' => [
                    'city' => $city,
                    'cached' => Cache::has($cacheKey),
                    'cache_key' => $cacheKey,
                    'cache_expires_at' => now()->addMinutes($cacheMinutes)->toIso8601String(),
                ],
            ])
        );
    }

    private function examplePayload(string $city): array
    {
        return [
            'city' => ucfirst($city),
            'country' => 'Sampleland',
            'current' => [
                'date' => now()->toFormattedDateString(),
                'temperature' => 22,
                'description' => 'clear sky',
                'icon' => '01d',
                'wind_speed' => 3.4,
                'humidity' => 42,
            ],
            'forecast' => collect(range(1, 3))->map(function ($offset) use ($city) {
                $date = now()->addDays($offset);

                return [
                    'date' => $date->toFormattedDateString(),
                    'icon' => Arr::random(['01d', '02d', '03d', '04d']),
                    'min_temp' => 18 - $offset,
                    'max_temp' => 25 - $offset,
                    'city' => ucfirst($city),
                ];
            })->all(),
        ];
    }
}
