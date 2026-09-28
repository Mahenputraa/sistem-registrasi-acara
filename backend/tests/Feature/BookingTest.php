<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\TicketType;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Event $event;

    private TicketType $ticketType;

    protected function setUp(): void
    {
        parent::setUp();

        $organizer = User::factory()->create(['role' => 'organizer']);
        $venue = Venue::create([
            'name' => 'Main Auditorium',
            'address' => 'Jl. Jenderal Sudirman No. 1',
            'city' => 'Jakarta',
            'type' => 'physical',
            'capacity' => 500,
        ]);

        $this->event = Event::create([
            'name' => 'Acara Tech Conference 2026',
            'description' => 'Konferensi teknologi tahunan',
            'start_time' => now()->addDays(10),
            'end_time' => now()->addDays(10)->addHours(8),
            'venue_id' => $venue->id,
            'organizer_id' => $organizer->id,
            'poster_url' => 'https://example.com/poster.jpg',
        ]);

        $this->ticketType = TicketType::create([
            'event_id' => $this->event->id,
            'name' => 'VIP Access',
            'price' => 250000,
            'capacity' => 5,
            'available_from' => now()->subDay(),
            'available_until' => now()->addDays(9),
        ]);

        $this->user = User::factory()->create(['role' => 'user']);
    }

    public function test_user_can_book_tickets_successfully(): void
    {
        $payload = [
            'event_id' => $this->event->id,
            'payment_method' => 'QRIS Instant',
            'items' => [
                [
                    'ticket_type_id' => $this->ticketType->id,
                    'attendee_name' => 'Budi Santoso',
                    'attendee_email' => 'budi@example.com',
                ],
                [
                    'ticket_type_id' => $this->ticketType->id,
                    'attendee_name' => 'Siti Rahma',
                    'attendee_email' => 'siti@example.com',
                ],
            ],
        ];

        $response = $this->actingAs($this->user)->postJson('/api/registrations', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Pendaftaran dan pemesanan tiket berhasil!',
            ]);

        $this->assertDatabaseHas('registrations', [
            'user_id' => $this->user->id,
            'event_id' => $this->event->id,
            'total_amount' => 500000,
            'payment_status' => 'paid',
        ]);

        $this->assertDatabaseCount('tickets', 2);
    }

    public function test_booking_fails_when_capacity_is_exceeded(): void
    {
        // Ticket capacity is 5, attempting to book 6
        $items = [];
        for ($i = 1; $i <= 6; $i++) {
            $items[] = [
                'ticket_type_id' => $this->ticketType->id,
                'attendee_name' => "Peserta {$i}",
                'attendee_email' => "peserta{$i}@example.com",
            ];
        }

        $payload = [
            'event_id' => $this->event->id,
            'payment_method' => 'QRIS',
            'items' => $items,
        ];

        $response = $this->actingAs($this->user)->postJson('/api/registrations', $payload);

        // Capacity is 5, requesting 6 items: BookingService throws Exception with status 422
        $response->assertStatus(422);
    }

    public function test_booking_rejects_exceeding_max_items_limit(): void
    {
        // max:10 limit
        $items = [];
        for ($i = 1; $i <= 11; $i++) {
            $items[] = [
                'ticket_type_id' => $this->ticketType->id,
                'attendee_name' => "Peserta {$i}",
                'attendee_email' => "peserta{$i}@example.com",
            ];
        }

        $payload = [
            'event_id' => $this->event->id,
            'payment_method' => 'QRIS',
            'items' => $items,
        ];

        $response = $this->actingAs($this->user)->postJson('/api/registrations', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items']);
    }
}
