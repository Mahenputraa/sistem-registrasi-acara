<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Registration;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckInTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Ticket $ticket;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $venue = Venue::create([
            'name' => 'Exhibition Hall A',
            'address' => 'Jl. MH Thamrin',
            'city' => 'Jakarta',
            'type' => 'physical',
            'capacity' => 1000,
        ]);

        $event = Event::create([
            'name' => 'Acara Tech Expo 2026',
            'description' => 'Expo teknologi',
            'start_time' => now()->addDays(5),
            'end_time' => now()->addDays(5)->addHours(6),
            'venue_id' => $venue->id,
            'organizer_id' => $this->admin->id,
            'poster_url' => 'https://example.com/expo.jpg',
        ]);

        $ticketType = TicketType::create([
            'event_id' => $event->id,
            'name' => 'Regular Pass',
            'price' => 100000,
            'capacity' => 100,
            'available_from' => now()->subDay(),
            'available_until' => now()->addDays(4),
        ]);

        $registration = Registration::create([
            'registration_number' => 'REG-TEST-001',
            'user_id' => $this->admin->id,
            'event_id' => $event->id,
            'total_amount' => 100000,
            'payment_status' => 'paid',
            'payment_method' => 'QRIS',
        ]);

        $this->ticket = Ticket::create([
            'registration_id' => $registration->id,
            'ticket_type_id' => $ticketType->id,
            'attendee_name' => 'Andi Wijaya',
            'attendee_email' => 'andi@example.com',
            'ticket_code' => 'TKT-TEST-999',
            'status' => 'active',
            'checked_in_at' => null,
        ]);
    }

    public function test_valid_ticket_can_be_checked_in_successfully(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/check-in', [
            'ticket_code' => 'TKT-TEST-999',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        $this->assertDatabaseHas('tickets', [
            'id' => $this->ticket->id,
            'status' => 'checked-in',
        ]);
    }

    public function test_already_checked_in_ticket_returns_warning(): void
    {
        // First check-in
        $this->actingAs($this->admin)->postJson('/api/check-in', [
            'ticket_code' => 'TKT-TEST-999',
        ])->assertStatus(200);

        // Second check-in attempt with identical code
        $secondResponse = $this->actingAs($this->admin)->postJson('/api/check-in', [
            'ticket_code' => 'TKT-TEST-999',
        ]);

        $secondResponse->assertStatus(422)
            ->assertJson([
                'status' => 'warning',
            ]);
    }

    public function test_non_existent_ticket_returns_404(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/check-in', [
            'ticket_code' => 'TKT-INVALID-000',
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
            ]);
    }

    public function test_regular_attendee_cannot_check_in_ticket(): void
    {
        $attendee = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($attendee)->postJson('/api/check-in', [
            'ticket_code' => 'TKT-TEST-999',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
            ]);
    }

    public function test_event_organizer_can_check_in_ticket(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $this->ticket->registration->event->update(['organizer_id' => $organizer->id]);

        $response = $this->actingAs($organizer)->postJson('/api/check-in', [
            'ticket_code' => 'TKT-TEST-999',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);
    }
}
