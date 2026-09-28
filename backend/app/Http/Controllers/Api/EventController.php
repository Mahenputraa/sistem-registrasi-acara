<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService
    ) {}

    private function getEventRelations(): array
    {
        return [
            'venue',
            'ticketTypes' => function ($q) {
                $q->withCount(['tickets as sold_count' => function ($sq) {
                    $sq->where('status', '!=', 'cancelled');
                }]);
            },
            'organizer',
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $query = Event::with($this->getEventRelations());

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $type = $request->query('type');
            if (in_array($type, ['physical', 'online'])) {
                $query->whereHas('venue', function ($q) use ($type) {
                    $q->where('type', $type);
                });
            }
        }

        if ($request->boolean('paginate') || $request->has('page')) {
            $perPage = min(50, max(1, (int) $request->query('per_page', 12)));
            $events = $query->orderBy('start_time', 'asc')->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => EventResource::collection($events),
                'meta' => [
                    'current_page' => $events->currentPage(),
                    'last_page' => $events->lastPage(),
                    'per_page' => $events->perPage(),
                    'total' => $events->total(),
                ],
            ])->header('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
        }

        $events = $query->orderBy('start_time', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => EventResource::collection($events),
        ])->header('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    }

    public function show(int $id): JsonResponse
    {
        $event = Event::with($this->getEventRelations())->find($id);

        if (! $event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Acara tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => new EventResource($event),
        ])->header('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $event = $this->eventService->createEvent(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Acara berhasil dibuat',
            'data' => new EventResource($event),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $event = Event::find($id);

        if (! $event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Acara tidak ditemukan',
            ], 404);
        }

        Gate::authorize('update', $event);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after_or_equal:start_time',
            'venue_id' => 'sometimes|required|exists:venues,id',
            'poster_url' => 'nullable|string|url',
            'ticket_types' => 'sometimes|array|min:1',
            'ticket_types.*.id' => 'nullable|integer',
            'ticket_types.*.name' => 'required|string|max:100',
            'ticket_types.*.price' => 'required|numeric|min:0',
            'ticket_types.*.capacity' => 'required|integer|min:1',
        ]);

        $updatedEvent = $this->eventService->updateEvent($event, $validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Acara berhasil diperbarui',
            'data' => new EventResource($updatedEvent),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $event = Event::find($id);

        if (! $event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Acara tidak ditemukan',
            ], 404);
        }

        Gate::authorize('delete', $event);

        $this->eventService->deleteEvent($event);

        return response()->json([
            'status' => 'success',
            'message' => 'Acara berhasil dihapus',
        ]);
    }
}
