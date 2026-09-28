<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    /**
     * Determine whether the user can create events.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'organizer';
    }

    /**
     * Determine whether the user can update the event.
     */
    public function update(User $user, Event $event): bool
    {
        return $user->role === 'admin' || (int) $user->id === (int) $event->organizer_id;
    }

    /**
     * Determine whether the user can delete the event.
     */
    public function delete(User $user, Event $event): bool
    {
        return $user->role === 'admin' || (int) $user->id === (int) $event->organizer_id;
    }
}
