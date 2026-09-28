<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => Venue::orderBy('name', 'asc')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user || ($user->role !== 'admin' && $user->role !== 'organizer')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya admin atau organizer yang berhak menambahkan venue.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:physical,online',
            'address' => 'nullable|string',
            'platform' => 'nullable|string',
            'url' => 'nullable|url',
        ]);

        $venue = Venue::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Venue berhasil ditambahkan',
            'data' => $venue,
        ], 201);
    }
}
