<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CheckInService
{
    /**
     * Process ticket check-in and prevent reuse with pessimistic concurrency lock.
     */
    public function checkIn(string $ticketCode, ?User $scannerUser = null): array
    {
        return DB::transaction(function () use ($ticketCode, $scannerUser) {
            $ticket = Ticket::with(['registration.event', 'ticketType'])
                ->where('ticket_code', trim($ticketCode))
                ->lockForUpdate()
                ->first();

            if (! $ticket) {
                return [
                    'status' => 'error',
                    'statusCode' => 404,
                    'message' => 'Tiket tidak ditemukan atau kode tiket salah.',
                    'data' => null,
                ];
            }

            // Otorisasi: hanya admin sistem atau organizer pemilik acara yang berhak melakukan check-in
            if ($scannerUser && $scannerUser->role !== 'admin') {
                $organizerId = $ticket->registration?->event?->organizer_id;
                if ((int) $scannerUser->id !== (int) $organizerId) {
                    return [
                        'status' => 'error',
                        'statusCode' => 403,
                        'message' => 'Anda tidak memiliki wewenang untuk melakukan check-in pada acara ini.',
                        'data' => null,
                    ];
                }
            }

            if ($ticket->status === 'checked-in') {
                $checkInTime = $ticket->checked_in_at ? $ticket->checked_in_at->format('d M Y H:i:s') : 'sebelumnya';

                return [
                    'status' => 'warning',
                    'statusCode' => 422,
                    'message' => "Tiket ini SUDAH PERNAH digunakan untuk check-in pada: {$checkInTime}.",
                    'data' => $ticket,
                ];
            }

            if ($ticket->status === 'cancelled') {
                return [
                    'status' => 'error',
                    'statusCode' => 422,
                    'message' => 'Tiket ini telah dibatalkan.',
                    'data' => $ticket,
                ];
            }

            $ticket->update([
                'status' => 'checked-in',
                'checked_in_at' => now(),
            ]);

            return [
                'status' => 'success',
                'statusCode' => 200,
                'message' => "Check-in berhasil! Selamat datang, {$ticket->attendee_name}.",
                'data' => $ticket->fresh(['registration.event', 'ticketType']),
            ];
        });
    }
}
