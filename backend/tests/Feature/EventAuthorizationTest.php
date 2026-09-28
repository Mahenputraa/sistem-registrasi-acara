<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $organizer;

    private User $attendee;

    private Venue $venue;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->organizer = User::factory()->create(['role' => 'organizer']);
        $this->attendee = User::factory()->create(['role' => 'user']);

        $this->venue = Venue::create([
            'name' => 'Auditorium Utama',
            'type' => 'physical',
            'address' => 'Jl. Sudirman No. 10',
            'city' => 'Jakarta',
            'capacity' => 200,
        ]);
    }

    public function test_attendee_cannot_create_event(): void
    {
        $payload = [
            'name' => 'Acara Ilegal',
            'description' => 'Mencoba membuat event tanpa wewenang',
            'start_time' => now()->addDays(5)->toDateTimeString(),
            'end_time' => now()->addDays(5)->addHours(2)->toDateTimeString(),
            'venue_id' => $this->venue->id,
            'ticket_types' => [
                ['name' => 'General', 'price' => 50000, 'capacity' => 100],
            ],
        ];

        $response = $this->actingAs($this->attendee)->postJson('/api/events', $payload);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_event(): void
    {
        $payload = [
            'name' => 'Acara Resmi Admin',
            'description' => 'Event resmi oleh admin',
            'start_time' => now()->addDays(5)->toDateTimeString(),
            'end_time' => now()->addDays(5)->addHours(2)->toDateTimeString(),
            'venue_id' => $this->venue->id,
            'ticket_types' => [
                ['name' => 'General', 'price' => 50000, 'capacity' => 100],
            ],
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/events', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Acara berhasil dibuat',
            ]);
    }

    public function test_organizer_can_create_event(): void
    {
        $payload = [
            'name' => 'Acara Resmi Organizer',
            'description' => 'Event resmi oleh organizer',
            'start_time' => now()->addDays(7)->toDateTimeString(),
            'end_time' => now()->addDays(7)->addHours(3)->toDateTimeString(),
            'venue_id' => $this->venue->id,
            'ticket_types' => [
                ['name' => 'VIP', 'price' => 150000, 'capacity' => 50],
            ],
        ];

        $response = $this->actingAs($this->organizer)->postJson('/api/events', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
            ]);
    }

    public function test_attendee_cannot_create_venue(): void
    {
        $response = $this->actingAs($this->attendee)->postJson('/api/venues', [
            'name' => 'Venue Baru',
            'type' => 'physical',
            'address' => 'Jl. Merdeka',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_venue(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/venues', [
            'name' => 'Venue Baru Admin',
            'type' => 'physical',
            'address' => 'Jl. Thamrin No. 5',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
            ]);
    }
}
