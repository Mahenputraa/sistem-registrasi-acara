<?php

namespace App\Models;

use PDO;

class Event {
    private $conn;
    private $table = 'events';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll() {
        $query = "SELECT e.id, e.name, e.description, e.start_time, e.poster_url, v.name as venue_name
                  FROM " . $this->table . " e
                  LEFT JOIN venues v ON e.venue_id = v.id
                  ORDER BY e.start_time DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne($id) {
        $query = "SELECT 
                    e.id, e.name, e.description, e.start_time, e.end_time, e.poster_url, 
                    u.name as organizer_name,
                    v.id as venue_id, v.name as venue_name, v.type as venue_type, 
                    v.address as venue_address, v.platform as venue_platform, v.url as venue_url
                  FROM " . $this->table . " e
                  LEFT JOIN users u ON e.organizer_id = u.id
                  LEFT JOIN venues v ON e.venue_id = v.id
                  WHERE e.id = ?
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}