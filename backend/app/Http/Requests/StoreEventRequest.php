<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user && ($user->role === 'admin' || $user->role === 'organizer');
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'venue_id' => 'required|exists:venues,id',
            'poster_url' => 'nullable|string|url',
            'rundown' => 'nullable|array',
            'rundown.*.time' => 'required|string',
            'rundown.*.title' => 'required|string',
            'rundown.*.desc' => 'nullable|string',
            'ticket_types' => 'required|array|min:1',
            'ticket_types.*.name' => 'required|string|max:100',
            'ticket_types.*.price' => 'required|numeric|min:0',
            'ticket_types.*.capacity' => 'required|integer|min:1',
            'ticket_types.*.available_from' => 'nullable|date',
            'ticket_types.*.available_until' => 'nullable|date',
        ];
    }
}
