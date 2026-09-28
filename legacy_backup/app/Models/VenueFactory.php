<?php

namespace App\Models;

use InvalidArgumentException;

class VenueFactory {
    public static function create(array $data): Venue {
        if (!isset($data['venue_type'])) {
            throw new InvalidArgumentException("Tipe venue tidak ditemukan dalam data.");
        }

        switch ($data['venue_type']) {
            case 'physical':
                return new PhysicalVenue($data['venue_id'], $data['venue_name'], $data['venue_address']);
            case 'online':
                return new OnlineVenue($data['venue_id'], $data['venue_name'], $data['venue_platform'], $data['venue_url']);
            default:
                throw new InvalidArgumentException("Tipe venue tidak valid: " . $data['venue_type']);
        }
    }
}