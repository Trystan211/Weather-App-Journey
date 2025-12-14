<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class FavoriteCollection extends ResourceCollection
{
    public $collects = FavoriteResource::class;

    /**
     * Transform the resource collection into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }

    /**
     * Additional data to include with the response.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        if ($this->resource instanceof LengthAwarePaginator) {
            return [];
        }

        return [
            'meta' => [
                'count' => $this->collection->count(),
            ],
        ];
    }
}
