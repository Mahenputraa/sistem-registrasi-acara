<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventAttendeeController extends Controller
{
    /**
     * Menampilkan daftar dan ringkasan kehadiran peserta khusus untuk satu acara.
     */
    public function index(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $event = Event::with(['venue', 'ticketTypes'])->find($id);

        if (! $event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Acara tidak ditemukan.',
            ], 404);
        }

        // Pastikan hanya admin sistem atau penyelenggara acara terkait yang berhak mengakses
        if ($user->role !== 'admin' && $event->organizer_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki wewenang untuk memantau peserta acara ini.',
            ], 403);
        }

        $isPastEvent = $event->end_time ? $event->end_time->isPast() : false;

        $tickets = Ticket::whereHas('registration', function ($q) use ($event) {
            $q->where('event_id', $event->id);
        })
            ->with([
                'registration.user:id,name,email,avatar',
                'ticketType:id,name,price',
            ])
            ->orderBy('id', 'desc')
            ->get();

        $totalRegistered = $tickets->count();
        $checkedInCount = 0;
        $pendingCount = 0;
        $expiredCount = 0;

        $attendees = $tickets->map(function ($ticket) use ($isPastEvent, &$checkedInCount, &$pendingCount, &$expiredCount) {
            $status = $ticket->status;
            $monitoringStatus = 'pending';
            $statusLabel = 'Belum Check-In';

            if ($status === 'checked-in') {
                $monitoringStatus = 'checked-in';
                $statusLabel = 'Sudah Check-In';
                $checkedInCount++;
            } elseif ($status === 'cancelled') {
                $monitoringStatus = 'expired';
                $statusLabel = 'Hangus (Dibatalkan)';
                $expiredCount++;
            } elseif ($isPastEvent) {
                // Acara sudah selesai tetapi peserta belum check-in
                $monitoringStatus = 'expired';
                $statusLabel = 'Hangus (Acara Berakhir)';
                $expiredCount++;
            } else {
                $monitoringStatus = 'pending';
                $statusLabel = 'Belum Check-In';
                $pendingCount++;
            }

            $registeredUser = $ticket->registration?->user;

            return [
                'id' => $ticket->id,
                'ticket_code' => $ticket->ticket_code,
                'attendee_name' => $ticket->attendee_name,
                'attendee_email' => $ticket->attendee_email ?: $registeredUser?->email,
                'registered_user' => $registeredUser ? [
                    'id' => $registeredUser->id,
                    'name' => $registeredUser->name,
                    'email' => $registeredUser->email,
                    'avatar' => $registeredUser->avatar,
                    'avatar_url' => $registeredUser->avatar_url,
                ] : null,
                'registration_number' => $ticket->registration?->registration_number,
                'ticket_tier' => $ticket->ticketType ? [
                    'id' => $ticket->ticketType->id,
                    'name' => $ticket->ticketType->name,
                    'price' => (float) $ticket->ticketType->price,
                ] : null,
                'raw_status' => $ticket->status,
                'monitoring_status' => $monitoringStatus,
                'status_label' => $statusLabel,
                'booked_at' => $ticket->created_at?->toISOString(),
                'checked_in_at' => $ticket->checked_in_at?->toISOString(),
            ];
        });

        $totalCapacity = $event->ticketTypes->sum('capacity');
        $checkInRate = $totalRegistered > 0 ? round(($checkedInCount / $totalRegistered) * 100, 1) : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'event' => [
                    'id' => $event->id,
                    'name' => $event->name,
                    'poster_url' => $event->poster_url,
                    'start_time' => $event->start_time?->toISOString(),
                    'end_time' => $event->end_time?->toISOString(),
                    'is_past' => $isPastEvent,
                    'venue' => $event->venue ? [
                        'name' => $event->venue->name,
                        'type' => $event->venue->type,
                    ] : null,
                    'total_capacity' => $totalCapacity,
                ],
                'summary' => [
                    'total_registered' => $totalRegistered,
                    'checked_in_count' => $checkedInCount,
                    'pending_count' => $pendingCount,
                    'expired_count' => $expiredCount,
                    'check_in_rate' => $checkInRate,
                ],
                'attendees' => $attendees,
            ],
        ]);
    }
}
