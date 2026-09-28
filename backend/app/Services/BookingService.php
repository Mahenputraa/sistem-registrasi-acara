<?php

namespace App\Services;

use App\Models\Registration;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingService
{
    /**
     * Handle ticket booking with pessimistic locking to prevent race conditions.
     *
     * @throws \Exception
     */
    public function book(User $user, array $data): Registration
    {
        $eventId = $data['event_id'];
        $items = $data['items'];
        $paymentMethod = $data['payment_method'] ?? 'QRIS Instant';

        return DB::transaction(function () use ($user, $eventId, $items, $paymentMethod) {
            // Group items by ticket_type_id to lock and check each type
            $countsByType = [];
            foreach ($items as $item) {
                $typeId = $item['ticket_type_id'];
                $countsByType[$typeId] = ($countsByType[$typeId] ?? 0) + 1;
            }

            $totalAmount = 0;

            foreach ($countsByType as $typeId => $qty) {
                // Pessimistic Locking with lockForUpdate() in PostgreSQL
                $ticketType = TicketType::where('id', $typeId)
                    ->where('event_id', $eventId)
                    ->lockForUpdate()
                    ->first();

                if (! $ticketType) {
                    throw new \Exception('Tipe tiket tidak valid untuk acara ini.');
                }

                // Count active tickets sold
                $sold = Ticket::where('ticket_type_id', $typeId)
                    ->where('status', '!=', 'cancelled')
                    ->count();

                if ($sold + $qty > $ticketType->capacity) {
                    $remaining = max(0, $ticketType->capacity - $sold);
                    throw new \Exception("Kapasitas untuk tiket '{$ticketType->name}' tidak mencukupi. Sisa tiket: {$remaining}.");
                }

                $totalAmount += $ticketType->price * $qty;
            }

            // Create registration record
            $regNumber = 'REG-'.date('Ymd').'-'.strtoupper(Str::random(6));

            $registration = Registration::create([
                'registration_number' => $regNumber,
                'user_id' => $user->id,
                'event_id' => $eventId,
                'total_amount' => $totalAmount,
                'payment_status' => 'paid',
                'payment_method' => $paymentMethod,
            ]);

            // Create individual tickets
            foreach ($items as $item) {
                $ticketCode = 'TKT-'.strtoupper(Str::random(4)).'-'.strtoupper(Str::random(6));

                Ticket::create([
                    'registration_id' => $registration->id,
                    'ticket_type_id' => $item['ticket_type_id'],
                    'attendee_name' => $item['attendee_name'],
                    'attendee_email' => $item['attendee_email'] ?? $user->email,
                    'ticket_code' => $ticketCode,
                    'status' => 'active',
                    'checked_in_at' => null,
                ]);
            }

            return $registration->load(['tickets.ticketType', 'event.venue']);
        });
    }
}
