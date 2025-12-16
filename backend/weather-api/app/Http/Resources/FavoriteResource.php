<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'api_id' => $this->api_id,
            'title' => $this->title,
            'note' => $this->note,
            'meta' => $this->meta,
            'api_present' => (bool) $this->getAttribute('api_present'),
            'api_snapshot' => $this->getAttribute('api_snapshot'),
            'api_snapshot_status' => $this->getAttribute('api_snapshot_status'),
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
        ];
    }
}
