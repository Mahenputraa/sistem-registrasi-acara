<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_code' => $this->ticket_code,
            'attendee_name' => $this->attendee_name,
            'attendee_email' => $this->attendee_email,
            'status' => $this->status,
            'checked_in_at' => $this->checked_in_at,
            'ticket_type' => $this->whenLoaded('ticketType'),
            'registration' => $this->whenLoaded('registration'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
