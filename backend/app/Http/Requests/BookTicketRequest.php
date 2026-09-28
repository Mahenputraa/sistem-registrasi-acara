<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => 'required|exists:events,id',
            'payment_method' => 'nullable|string',
            'items' => 'required|array|min:1|max:10',
            'items.*.ticket_type_id' => 'required|exists:ticket_types,id',
            'items.*.attendee_name' => 'required|string|max:255',
            'items.*.attendee_email' => 'nullable|email|max:255',
        ];
    }
}
