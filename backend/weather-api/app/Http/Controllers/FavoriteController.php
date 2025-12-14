<?php

namespace App\Http\Controllers;

use App\Http\Resources\FavoriteCollection;
use App\Http\Resources\FavoriteResource;
use App\Models\Favorite;
use App\Services\FavoriteSnapshotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function __construct(private FavoriteSnapshotService $snapshotService)
    {
        $this->middleware('auth');
    }

    public function index(Request $r)
    {
        $perPage = (int) $r->integer('per_page', 10);
        $perPage = max(1, min($perPage, 50));

        if ($refreshId = (int) $r->input('refresh_id')) {
            $favorite = $r->user()
                ->favorites()
                ->whereKey($refreshId)
                ->first();

            if ($favorite) {
                $this->snapshotService->attachSnapshot($favorite);
            }
        }

        $favorites = $r->user()
            ->favorites()
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $favorites->setCollection(
            $this->snapshotService->attachSnapshots($favorites->getCollection())
        );

        $collection = new FavoriteCollection($favorites);

        if ($r->wantsJson()) {
            return $collection;
        }

        return Inertia::render('Favorites/Index', [
            'favorites' => $collection->response($r)->getData(true),
        ]);
    }

    public function store(Request $r)
    {
        $this->authorize('create', Favorite::class);
        $data = $r->validate([
            'api_id' => 'required|string',
            'title' => 'nullable|string',
            'note' => 'nullable|string',
            'meta' => 'nullable|array',
        ]);
        $data['user_id'] = Auth::id();
        $fav = Favorite::updateOrCreate(
            ['user_id' => $data['user_id'], 'api_id' => $data['api_id']],
            $data
        );
        $fav = $this->snapshotService->attachSnapshot($fav);

        if ($r->wantsJson()) {
            return (new FavoriteResource($fav))
                ->response()
                ->setStatusCode(201);
        }

        return redirect()->back()->with('status', 'favorite-saved');
    }

    public function update(Request $r, Favorite $favorite)
    {
        $this->authorize('update', $favorite);
        $favorite->update($r->only('title', 'note', 'meta'));
        $favorite = $this->snapshotService->attachSnapshot($favorite);

        return new FavoriteResource($favorite);
    }

    public function destroy(Favorite $favorite)
    {
        $this->authorize('delete', $favorite);
        $favorite->delete();

        if (request()->wantsJson()) {
            return response()->json(['deleted' => true]);
        }

        $page = max(1, (int) request()->input('page', 1));
        $perPage = max(1, (int) request()->input('per_page', 10));

        return redirect()
            ->route('favorites.page', ['page' => $page, 'per_page' => $perPage])
            ->with('status', 'favorite-deleted');
    }
}
