<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class WeatherStoryService
{
    public function getWeatherStory(string $city): ?array
    {
        $data = $this->fetchForecastData($city);

        return $data ? $this->formatForecast($data) : null;
    }

    protected function fetchForecastData(string $city): ?array
    {
        $apiKey = env('OPENWEATHERMAP_API_KEY');

        if (! $apiKey) {
            return null;
        }

        $cacheKey = 'weather:city:'.strtolower($city);

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($city, $apiKey) {
            $response = Http::get('https://api.openweathermap.org/data/2.5/forecast', [
                'q' => $city,
                'appid' => $apiKey,
                'units' => 'metric',
            ]);

            return $response->successful() ? $response->json() : null;
        });
    }

    protected function formatForecast(array $data): array
    {
        $forecasts = $data['list'] ?? [];
        $cityInfo = $data['city'] ?? [];

        $today = Carbon::now()->format('Y-m-d');
        $currentWeatherEntry = null;
        $dailyForecasts = [];

        foreach ($forecasts as $entry) {
            $date = substr($entry['dt_txt'], 0, 10);

            if ($date === $today && ! $currentWeatherEntry) {
                $currentWeatherEntry = [
                    'date' => Carbon::parse($entry['dt_txt'])->toFormattedDateString(),
                    'temperature' => round($entry['main']['temp']),
                    'description' => $entry['weather'][0]['description'] ?? null,
                    'weather_main' => $entry['weather'][0]['main'] ?? null,
                    'icon' => $entry['weather'][0]['icon'] ?? null,
                    'wind_speed' => $entry['wind']['speed'] ?? null,
                    'humidity' => $entry['main']['humidity'] ?? null,
                ];
            }

            if ($date !== $today) {
                if (! isset($dailyForecasts[$date])) {
                    $dailyForecasts[$date] = [
                        'date' => Carbon::parse($entry['dt_txt'])->toFormattedDateString(),
                        'min_temp' => $entry['main']['temp_min'],
                        'max_temp' => $entry['main']['temp_max'],
                        'icon' => $entry['weather'][0]['icon'] ?? null,
                    ];
                } else {
                    $dailyForecasts[$date]['min_temp'] = min($dailyForecasts[$date]['min_temp'], $entry['main']['temp_min']);
                    $dailyForecasts[$date]['max_temp'] = max($dailyForecasts[$date]['max_temp'], $entry['main']['temp_max']);
                }
            }

            if (count($dailyForecasts) >= 3) {
                break;
            }
        }

        return [
            'city_id' => $cityInfo['id'] ?? null,
            'city' => $cityInfo['name'] ?? 'Unknown',
            'country' => $cityInfo['country'] ?? null,
            'current' => $currentWeatherEntry,
            'forecast' => array_values($dailyForecasts),
        ];
    }
}
