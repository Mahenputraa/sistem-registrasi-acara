<?php

namespace App\Models;

use PDO;

class TicketType {
    private $conn;
    private $table = 'ticket_types';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findByEventId($eventId) {
        $query = "SELECT id, name, price, capacity, (SELECT COUNT(*) FROM tickets WHERE ticket_type_id = tt.id) as sold
                  FROM " . $this->table . " tt
                  WHERE event_id = ? AND available_from <= NOW() AND available_until >= NOW()";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $eventId);
        $stmt->execute();
        return $stmt;
    }
}