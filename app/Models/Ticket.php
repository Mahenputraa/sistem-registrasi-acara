<?php

namespace App\Models;

class Ticket {
    private $conn;
    private $table = 'tickets';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($registrationId, $ticketTypeId, $attendeeName) {
        $query = "INSERT INTO " . $this->table . " (registration_id, ticket_type_id, attendee_name, ticket_code) VALUES (:registration_id, :ticket_type_id, :attendee_name, :ticket_code)";
        $stmt = $this->conn->prepare($query);

        // Generate a unique ticket code
        $ticketCode = 'TICKET-' . strtoupper(bin2hex(random_bytes(8)));

        $stmt->bindParam(':registration_id', $registrationId);
        $stmt->bindParam(':ticket_type_id', $ticketTypeId);
        $stmt->bindParam(':attendee_name', $attendeeName);
        $stmt->bindParam(':ticket_code', $ticketCode);

        return $stmt->execute();
    }
}