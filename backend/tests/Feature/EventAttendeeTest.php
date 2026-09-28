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

class EventAttendeeTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_event_attendees(): void
    {
        $response = $this->getJson('/api/events/1/attendees');
        $response->assertStatus(401);
    }

    public function test_non_admin_cannot_access_attendees_of_event_they_do_not_own(): void
    {
        $organizer = User::factory()->create(['role' => 'user']);
        $venue = Venue::create(['name' => 'Venue A', 'type' => 'physical', 'address' => 'Jakarta']);
        $event = Event::create([
            'name' => 'Tech Summit',
            'description' => 'Summit description',
            'start_time' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHours(4),
            'venue_id' => $venue->id,
            'organizer_id' => $organizer->id,
        ]);

        $otherUser = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($otherUser)->getJson("/api/events/{$event->id}/attendees");
        $response->assertStatus(403);
    }

    public function test_admin_can_view_attendees_with_accurate_monitoring_statuses(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $venue = Venue::create(['name' => 'Main Hall', 'type' => 'physical', 'address' => 'Jakarta']);
        $event = Event::create([
            'name' => 'DevFest 2026',
            'description' => 'Developer festival',
            'start_time' => now()->addDays(1),
            'end_time' => now()->addDays(1)->addHours(6),
            'venue_id' => $venue->id,
            'organizer_id' => $admin->id,
        ]);

        $ticketType = TicketType::create([
            'event_id' => $event->id,
            'name' => 'VIP Access',
            'price' => 150000,
            'capacity' => 100,
            'available_from' => now()->subDay(),
            'available_until' => now()->addDays(2),
        ]);

        $user1 = User::factory()->create(['name' => 'Peserta Satu', 'email' => 'peserta1@example.com']);
        $reg1 = Registration::create([
            'registration_number' => 'REG-001',
            'user_id' => $user1->id,
            'event_id' => $event->id,
            'total_amount' => 150000,
            'payment_status' => 'paid',
        ]);
        Ticket::create([
            'registration_id' => $reg1->id,
            'ticket_type_id' => $ticketType->id,
            'attendee_name' => 'Peserta Satu',
            'attendee_email' => 'peserta1@example.com',
            'ticket_code' => 'TCK-CHECKEDIN',
            'status' => 'checked-in',
            'checked_in_at' => now(),
        ]);

        $user2 = User::factory()->create(['name' => 'Peserta Dua', 'email' => 'peserta2@example.com']);
        $reg2 = Registration::create([
            'registration_number' => 'REG-002',
            'user_id' => $user2->id,
            'event_id' => $event->id,
            'total_amount' => 150000,
            'payment_status' => 'paid',
        ]);
        Ticket::create([
            'registration_id' => $reg2->id,
            'ticket_type_id' => $ticketType->id,
            'attendee_name' => 'Peserta Dua',
            'attendee_email' => 'peserta2@example.com',
            'ticket_code' => 'TCK-PENDING',
            'status' => 'active',
            'checked_in_at' => null,
        ]);

        $user3 = User::factory()->create(['name' => 'Peserta Tiga', 'email' => 'peserta3@example.com']);
        $reg3 = Registration::create([
            'registration_number' => 'REG-003',
            'user_id' => $user3->id,
            'event_id' => $event->id,
            'total_amount' => 150000,
            'payment_status' => 'paid',
        ]);
        Ticket::create([
            'registration_id' => $reg3->id,
            'ticket_type_id' => $ticketType->id,
            'attendee_name' => 'Peserta Tiga',
            'attendee_email' => 'peserta3@example.com',
            'ticket_code' => 'TCK-CANCELLED',
            'status' => 'cancelled',
            'checked_in_at' => null,
        ]);

        $response = $this->actingAs($admin)->getJson("/api/events/{$event->id}/attendees");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'event' => [
                        'id' => $event->id,
                        'name' => 'DevFest 2026',
                    ],
                    'summary' => [
                        'total_registered' => 3,
                        'checked_in_count' => 1,
                        'pending_count' => 1,
                        'expired_count' => 1,
                    ],
                ],
            ]);

        $attendees = $response->json('data.attendees');
        $this->assertCount(3, $attendees);

        $checkedInItem = collect($attendees)->firstWhere('ticket_code', 'TCK-CHECKEDIN');
        $this->assertEquals('checked-in', $checkedInItem['monitoring_status']);

        $pendingItem = collect($attendees)->firstWhere('ticket_code', 'TCK-PENDING');
        $this->assertEquals('pending', $pendingItem['monitoring_status']);

        $cancelledItem = collect($attendees)->firstWhere('ticket_code', 'TCK-CANCELLED');
        $this->assertEquals('expired', $cancelledItem['monitoring_status']);
    }

    public function test_unattended_tickets_for_past_events_are_marked_as_expired(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $venue = Venue::create(['name' => 'Hall 2', 'type' => 'physical', 'address' => 'Bandung']);

        // Acara sudah berakhir 1 hari yang lalu
        $pastEvent = Event::create([
            'name' => 'AI Conference 2026',
            'description' => 'Past AI Conference',
            'start_time' => now()->subDays(2),
            'end_time' => now()->subDays(1),
            'venue_id' => $venue->id,
            'organizer_id' => $admin->id,
        ]);

        $ticketType = TicketType::create([
            'event_id' => $pastEvent->id,
            'name' => 'Regular',
            'price' => 50000,
            'capacity' => 50,
            'available_from' => now()->subDays(5),
            'available_until' => now()->subDays(1),
        ]);

        $user = User::factory()->create();
        $reg = Registration::create([
            'registration_number' => 'REG-PAST-01',
            'user_id' => $user->id,
            'event_id' => $pastEvent->id,
            'total_amount' => 50000,
            'payment_status' => 'paid',
        ]);

        Ticket::create([
            'registration_id' => $reg->id,
            'ticket_type_id' => $ticketType->id,
            'attendee_name' => 'Peserta Terlambat',
            'attendee_email' => 'late@example.com',
            'ticket_code' => 'TCK-EXPIRED-PAST',
            'status' => 'active', // Belum check-in padahal acara sudah selesai
            'checked_in_at' => null,
        ]);

        $response = $this->actingAs($admin)->getJson("/api/events/{$pastEvent->id}/attendees");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'summary' => [
                        'total_registered' => 1,
                        'checked_in_count' => 0,
                        'pending_count' => 0,
                        'expired_count' => 1,
                    ],
                ],
            ]);

        $attendees = $response->json('data.attendees');
        $this->assertEquals('expired', $attendees[0]['monitoring_status']);
        $this->assertStringContainsString('Hangus', $attendees[0]['status_label']);
    }
}
