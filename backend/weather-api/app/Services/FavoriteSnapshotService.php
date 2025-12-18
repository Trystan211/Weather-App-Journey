<?php

namespace App\Services;

use App\Models\Favorite;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class FavoriteSnapshotService
{
    public function attachSnapshots(Collection $favorites): Collection
    {
        return $favorites->map(function (Favorite $favorite) {
            $api = $this->fetchApiById($favorite->api_id);

            if ($api) {
                $this->persistSnapshot($favorite, $api);

                $favorite->setAttribute('api_present', true);
                $favorite->setAttribute('api_snapshot', $api);
                $favorite->setAttribute('api_snapshot_status', 'live');

                return $favorite;
            }

            $fallback = $this->getFallbackSnapshot($favorite);

            $favorite->setAttribute('api_present', false);
            $favorite->setAttribute('api_snapshot', $fallback);
            $favorite->setAttribute('api_snapshot_status', $fallback ? 'stale' : 'missing');

            return $favorite;
        });
    }

    public function attachSnapshot(Favorite $favorite): Favorite
    {
        $this->attachSnapshots(collect([$favorite]));

        return $favorite;
    }

    protected function fetchApiById(string $apiId): ?array
    {
        $apiKey = env('OPENWEATHERMAP_API_KEY');

        if (! $apiKey) {
            return null;
        }

        $cacheKey = 'weather:api:'.strtolower($apiId);

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($apiId, $apiKey) {
            $response = Http::get('https://api.openweathermap.org/data/2.5/weather', [
                'id' => $apiId,
                'appid' => $apiKey,
                'units' => 'metric',
            ]);

            if ($response->failed()) {
                return null;
            }

            return $response->json();
        });
    }

    protected function persistSnapshot(Favorite $favorite, array $snapshot): void
    {
        $meta = $favorite->meta ?? [];
        $hash = md5(json_encode($snapshot));

        if (Arr::get($meta, 'last_snapshot_hash') === $hash) {
            return;
        }

        $meta['last_snapshot'] = $snapshot;
        $meta['last_snapshot_hash'] = $hash;
        $meta['last_snapshot_at'] = now()->toIso8601String();

        $favorite->forceFill(['meta' => $meta])->saveQuietly();
    }

    protected function getFallbackSnapshot(Favorite $favorite): ?array
    {
        return Arr::get($favorite->meta, 'last_snapshot');
    }
}
