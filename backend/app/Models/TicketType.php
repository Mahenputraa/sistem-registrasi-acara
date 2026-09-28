<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TicketType extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'price',
        'capacity',
        'available_from',
        'available_until',
    ];

    protected $casts = [
        'price' => 'float',
        'capacity' => 'integer',
        'available_from' => 'datetime',
        'available_until' => 'datetime',
    ];

    protected $appends = ['sold_count', 'remaining_capacity'];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function getSoldCountAttribute(): int
    {
        if (array_key_exists('sold_count', $this->attributes)) {
            return (int) $this->attributes['sold_count'];
        }

        return $this->tickets()->where('status', '!=', 'cancelled')->count();
    }

    public function getRemainingCapacityAttribute(): int
    {
        return max(0, $this->capacity - $this->sold_count);
    }
}
