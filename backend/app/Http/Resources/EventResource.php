<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'rundown' => $this->rundown,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'poster_url' => $this->poster_url,
            'venue' => $this->whenLoaded('venue'),
            'ticket_types' => $this->whenLoaded('ticketTypes'),
            'organizer' => $this->whenLoaded('organizer'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
