<?php

namespace App\Http\Controllers;

use App\Services\FavoriteSnapshotService;
use App\Services\WeatherStoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JourneyController extends Controller
{
    public function __construct(
        private FavoriteSnapshotService $snapshotService,
        private WeatherStoryService $weatherService
    ) {
        $this->middleware(['auth', 'verified']);
    }

    public function __invoke(Request $request)
    {
        $favorites = $this->snapshotService->attachSnapshots(
            $request->user()->favorites()->get()
        );

        $selectedCity = $request->query('city')
            ?? ($favorites->first()->api_snapshot['name'] ?? null)
            ?? 'Butuan';

        $story = $this->weatherService->getWeatherStory($selectedCity);

        $journeySteps = $this->buildJourneySteps($story, $favorites->count());

        return Inertia::render('Journey', [
            'journey' => [
                'city_id' => $story['city_id'] ?? null,
                'city' => $story['city'] ?? $selectedCity,
                'country' => $story['country'] ?? null,
                'current' => $story['current'] ?? null,
                'forecast' => $story['forecast'] ?? [],
                'steps' => $journeySteps,
            ],
            'favorites' => $favorites,
        ]);
    }

    protected function buildJourneySteps(?array $story, int $favoriteCount): array
    {
        $hasForecast = !empty($story['forecast']);
        
        return [
            [
                'title' => 'Start: Current Weather',
                'subtitle' => 'Ground yourself in today\'s conditions before planning ahead.',
                'status' => 'completed', // Always completed when viewing journey page
                'payload' => $story['current'] ?? null,
            ],
            [
                'title' => 'Step 1: Explore Forecasts',
                'subtitle' => 'Scan the next few days to spot opportunities or incoming storms.',
                'status' => $hasForecast ? 'completed' : 'upcoming',
                'payload' => $story['forecast'] ?? [],
            ],
            [
                'title' => 'Step 2: Save to My Journal',
                'subtitle' => 'Pin locations that matter so you can revisit their snapshots later.',
                'status' => $favoriteCount > 0 ? 'completed' : 'current',
                'payload' => $favoriteCount,
            ],
            [
                'title' => 'Step 3: Track the Journey',
                'subtitle' => 'Use your saved spots as a mini timeline—filter, compare, and plan.',
                'status' => $favoriteCount > 2 ? 'completed' : 'upcoming',
                'payload' => $favoriteCount,
            ],
        ];
    }
}
