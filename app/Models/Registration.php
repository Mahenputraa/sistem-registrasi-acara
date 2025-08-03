<?php
namespace App\Models;

use PDO;

class Registration {
    private $conn;
    private $table = 'registrations';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($userId, $eventId, $totalAmount) {
        $query = "INSERT INTO " . $this->table . " (user_id, event_id, total_amount, payment_status) VALUES (:user_id, :event_id, :total_amount, 'paid')";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':event_id', $eventId);
        $stmt->bindParam(':total_amount', $totalAmount);
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // BARU: Method untuk mencari pendaftaran berdasarkan ID pengguna
    public function findByUserId($userId) {
        $query = "SELECT r.id, r.order_date, r.total_amount, e.name as event_name, e.start_time
                  FROM " . $this->table . " r
                  JOIN events e ON r.event_id = e.id
                  WHERE r.user_id = ?
                  ORDER BY r.order_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // BARU: Method untuk mencari pendaftaran tunggal berdasarkan ID-nya
    public function findById($id) {
        $query = "SELECT r.id, r.order_date, r.total_amount, r.user_id,
                         e.name as event_name, e.start_time,
                         v.name as venue_name, v.type as venue_type, v.address as venue_address, v.platform as venue_platform, v.url as venue_url,
                         t.attendee_name, t.ticket_code, tt.name as ticket_type_name
                  FROM " . $this->table . " r
                  JOIN events e ON r.event_id = e.id
                  JOIN venues v ON e.venue_id = v.id
                  JOIN tickets t ON t.registration_id = r.id
                  JOIN ticket_types tt ON t.ticket_type_id = tt.id
                  WHERE r.id = ?
                  LIMIT 1"; // Ambil satu tiket saja untuk detail utama
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // BARU: Method untuk mengambil semua pendaftaran (untuk admin)
    public function findAll() {
        $query = "SELECT r.id, r.order_date, u.name as user_name, e.name as event_name, r.total_amount, r.payment_status
                  FROM " . $this->table . " r
                  JOIN users u ON r.user_id = u.id
                  JOIN events e ON r.event_id = e.id
                  ORDER BY r.order_date DESC";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}