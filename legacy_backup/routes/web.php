<?php
use App\Controllers\AuthController;
use App\Controllers\EventController;
use App\Controllers\AdminController;
use App\Controllers\UserController;

return [
    'GET' => [
        '/' => [EventController::class, 'index'],
        '/events/(\d+)' => [EventController::class, 'show'],
        '/events/ticket/success' => [EventController::class, 'showTicketSuccess'],
        '/login' => [AuthController::class, 'showLogin'],
        '/register' => [AuthController::class, 'showRegister'],
        '/logout' => [AuthController::class, 'logout'],
        // Rute untuk Pengguna
        '/my-tickets' => [UserController::class, 'showMyTickets'],
        '/registrations/(\d+)' => [UserController::class, 'showTicketDetail'],
        // Rute Admin
        '/admin/dashboard' => [AdminController::class, 'dashboard'],
        '/admin/events' => [AdminController::class, 'listEvents'],
        '/admin/events/create' => [AdminController::class, 'showEventForm'],
        '/admin/events/edit/(\d+)' => [AdminController::class, 'showEventForm'],
        '/admin/events/delete/(\d+)' => [AdminController::class, 'deleteEvent'],
        '/admin/events/(\d+)/tickets' => [AdminController::class, 'listTicketTypes'],
        '/admin/tickets/create/(\d+)' => [AdminController::class, 'createTicketTypeForm'],
        '/admin/tickets/edit/(\d+)' => [AdminController::class, 'editTicketTypeForm'],
        '/admin/tickets/delete/(\d+)' => [AdminController::class, 'deleteTicketType'],
        '/admin/registrations' => [AdminController::class, 'listRegistrations'],
    ],
    'POST' => [
        '/login' => [AuthController::class, 'login'],
        '/register' => [AuthController::class, 'register'],
        '/events/(\d+)/register' => [EventController::class, 'register'],
        '/admin/events/store' => [AdminController::class, 'storeEvent'],
        '/admin/events/update/(\d+)' => [AdminController::class, 'updateEvent'],
        '/admin/tickets/store' => [AdminController::class, 'storeTicketType'],
        '/admin/tickets/update/(\d+)' => [AdminController::class, 'updateTicketType'],
    ],
];