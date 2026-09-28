<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventAttendeeController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\VenueController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/ping', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Event Platform API is running smoothly',
        'timestamp' => now()->toISOString(),
    ]);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
});

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/venues', [VenueController::class, 'index']);

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Profile Management
    Route::prefix('profile')->group(function () {
        Route::post('/update', [ProfileController::class, 'update']);
        Route::delete('/avatar', [ProfileController::class, 'removeAvatar']);
        Route::put('/password', [ProfileController::class, 'updatePassword']);
    });

    // Registrations & Tickets
    Route::post('/registrations', [RegistrationController::class, 'store']);
    Route::get('/my-tickets', [RegistrationController::class, 'myTickets']);
    Route::get('/my-registrations', [RegistrationController::class, 'myRegistrations']);

    // Check-in Scanner
    Route::post('/check-in', [RegistrationController::class, 'checkIn']);

    // Admin / Organizer Management
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
    Route::post('/venues', [VenueController::class, 'store']);

    // Event Attendees Monitoring (Admin / Organizer)
    Route::get('/events/{id}/attendees', [EventAttendeeController::class, 'index']);
});
