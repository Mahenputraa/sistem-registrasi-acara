<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookTicketRequest;
use App\Http\Requests\CheckInRequest;
use App\Http\Resources\RegistrationResource;
use App\Http\Resources\TicketResource;
use App\Models\Registration;
use App\Models\Ticket;
use App\Services\BookingService;
use App\Services\CheckInService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function __construct(
        protected BookingService $bookingService,
        protected CheckInService $checkInService
    ) {}

    public function store(BookTicketRequest $request): JsonResponse
    {
        try {
            $registration = $this->bookingService->book(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Pendaftaran dan pemesanan tiket berhasil!',
                'data' => new RegistrationResource($registration),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function myTickets(Request $request): JsonResponse
    {
        $user = $request->user();

        $tickets = Ticket::whereHas('registration', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
            ->with(['ticketType', 'registration.event.venue', 'registration.event.organizer'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => TicketResource::collection($tickets),
        ]);
    }

    public function myRegistrations(Request $request): JsonResponse
    {
        $user = $request->user();

        $registrations = Registration::where('user_id', $user->id)
            ->with(['event.venue', 'tickets.ticketType'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => RegistrationResource::collection($registrations),
        ]);
    }

    public function checkIn(CheckInRequest $request): JsonResponse
    {
        $result = $this->checkInService->checkIn(
            $request->validated()['ticket_code'],
            $request->user()
        );

        $statusCode = $result['statusCode'];
        unset($result['statusCode']);

        if ($result['data'] instanceof Ticket) {
            $result['data'] = new TicketResource($result['data']);
        }

        return response()->json($result, $statusCode);
    }
}
