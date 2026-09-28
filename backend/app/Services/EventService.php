<?php

namespace App\Services;

use App\Models\Event;
use App\Models\TicketType;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class EventService
{
    /**
     * Create an event with its ticket types within a database transaction.
     */
    public function createEvent(User $organizer, array $data): Event
    {
        return DB::transaction(function () use ($organizer, $data) {
            $event = Event::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'venue_id' => $data['venue_id'],
                'organizer_id' => $organizer->id,
                'rundown' => $data['rundown'] ?? null,
                'poster_url' => $data['poster_url'] ?? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
            ]);

            foreach ($data['ticket_types'] as $tt) {
                TicketType::create([
                    'event_id' => $event->id,
                    'name' => $tt['name'],
                    'price' => $tt['price'],
                    'capacity' => $tt['capacity'],
                    'available_from' => $tt['available_from'] ?? now(),
                    'available_until' => $tt['available_until'] ?? $data['start_time'],
                ]);
            }

            return $event->load(['venue', 'ticketTypes', 'organizer']);
        });
    }

    /**
     * Update existing event details.
     */
    public function updateEvent(Event $event, array $data): Event
    {
        return DB::transaction(function () use ($event, $data) {
            $eventData = collect($data)->except('ticket_types')->toArray();
            $event->update($eventData);

            if (isset($data['ticket_types']) && is_array($data['ticket_types'])) {
                $processedIds = [];

                foreach ($data['ticket_types'] as $tt) {
                    if (! empty($tt['id'])) {
                        $ticketType = TicketType::where('id', $tt['id'])
                            ->where('event_id', $event->id)
                            ->first();

                        if ($ticketType) {
                            $capacity = max((int) $tt['capacity'], $ticketType->sold_count);
                            $ticketType->update([
                                'name' => $tt['name'],
                                'price' => $tt['price'],
                                'capacity' => $capacity,
                            ]);
                            $processedIds[] = $ticketType->id;
                        }
                    } else {
                        $newTicketType = TicketType::create([
                            'event_id' => $event->id,
                            'name' => $tt['name'],
                            'price' => $tt['price'],
                            'capacity' => (int) $tt['capacity'],
                            'available_from' => now(),
                            'available_until' => $event->start_time,
                        ]);
                        $processedIds[] = $newTicketType->id;
                    }
                }

                // Delete ticket types that were removed from form, BUT ONLY IF no tickets have been sold
                $existingTicketTypes = TicketType::where('event_id', $event->id)->get();
                foreach ($existingTicketTypes as $existing) {
                    if (! in_array($existing->id, $processedIds)) {
                        if ($existing->sold_count === 0) {
                            $existing->delete();
                        }
                    }
                }
            }

            return $event->fresh(['venue', 'ticketTypes', 'organizer']);
        });
    }

    /**
     * Delete an event.
     */
    public function deleteEvent(Event $event): void
    {
        $event->delete();
    }
}
