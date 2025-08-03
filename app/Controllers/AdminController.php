<?php
namespace App\Controllers;

use App\Config\Database;
use PDO;

class AdminController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Helper untuk mengatur flash message
    private function setFlashMessage($message, $type = 'success') {
        $_SESSION['flash_message'] = [
            'message' => $message,
            'type' => $type
        ];
    }

    public function dashboard() {
        $event_count = $this->db->query("SELECT count(*) FROM events")->fetchColumn();
        $user_count = $this->db->query("SELECT count(*) FROM users")->fetchColumn();
        $registration_count = $this->db->query("SELECT count(*) FROM registrations")->fetchColumn();

        $data = [
            'event_count' => $event_count,
            'user_count' => $user_count,
            'registration_count' => $registration_count
        ];
        
        $page_title = "Admin Dashboard";
        ob_start();
        include_once __DIR__ . '/../../templates/admin/dashboard.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/admin_layout.php';
    }

    // == CRUD UNTUK ACARA (EVENTS) ==
    public function listEvents() {
        $stmt = $this->db->query("SELECT id, name, start_time FROM events ORDER BY start_time DESC");
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $page_title = "Kelola Acara";
        ob_start();
        include_once __DIR__ . '/../../templates/admin/events/index.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/admin_layout.php';
    }

    public function showEventForm($id = null) {
        $event = null;
        if ($id) {
            $stmt = $this->db->prepare("SELECT * FROM events WHERE id = ?");
            $stmt->execute([$id]);
            $event = $stmt->fetch(PDO::FETCH_ASSOC);
        }

        $venues = $this->db->query("SELECT id, name FROM venues")->fetchAll(PDO::FETCH_ASSOC);
        $organizers = $this->db->query("SELECT id, name FROM users WHERE role = 'admin'")->fetchAll(PDO::FETCH_ASSOC);
        
        $page_title = $id ? "Edit Acara" : "Buat Acara Baru";
        ob_start();
        include_once __DIR__ . '/../../templates/admin/events/form.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/admin_layout.php';
    }

    public function storeEvent() {
        $query = "INSERT INTO events (name, description, start_time, end_time, venue_id, organizer_id, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            $_POST['name'], $_POST['description'], $_POST['start_time'], $_POST['end_time'],
            $_POST['venue_id'], $_POST['organizer_id'],
            $_POST['poster_url'] ?: 'https://placehold.co/600x400/3498db/ffffff?text=Event'
        ]);
        $this->setFlashMessage('Acara baru berhasil dibuat.');
        header('Location: ' . BASE_URL . '/admin/events');
        exit;
    }

    public function updateEvent($id) {
        $query = "UPDATE events SET name = ?, description = ?, start_time = ?, end_time = ?, venue_id = ?, organizer_id = ?, poster_url = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            $_POST['name'], $_POST['description'], $_POST['start_time'], $_POST['end_time'],
            $_POST['venue_id'], $_POST['organizer_id'],
            $_POST['poster_url'] ?: 'https://placehold.co/600x400/3498db/ffffff?text=Event',
            $id
        ]);
        $this->setFlashMessage('Data acara berhasil diperbarui.');
        header('Location: ' . BASE_URL . '/admin/events');
        exit;
    }

    public function deleteEvent($id) {
        $this->db->prepare("DELETE FROM ticket_types WHERE event_id = ?")->execute([$id]);
        $this->db->prepare("DELETE FROM registrations WHERE event_id = ?")->execute([$id]);
        $this->db->prepare("DELETE FROM events WHERE id = ?")->execute([$id]);
        $this->setFlashMessage('Acara dan semua data terkait berhasil dihapus.', 'danger');
        header('Location: ' . BASE_URL . '/admin/events');
        exit;
    }

    // == CRUD UNTUK TIPE TIKET (TICKET TYPES) ==
    public function listTicketTypes($eventId) {
        $stmt = $this->db->prepare("SELECT tt.*, (SELECT COUNT(*) FROM tickets t WHERE t.ticket_type_id = tt.id) as sold FROM ticket_types tt WHERE tt.event_id = ? ORDER BY tt.price");
        $stmt->execute([$eventId]);
        $ticketTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $eventStmt = $this->db->prepare("SELECT name FROM events WHERE id = ?");
        $eventStmt->execute([$eventId]);
        $event = $eventStmt->fetch(PDO::FETCH_ASSOC);

        if (!$event) {
            http_response_code(404);
            echo "<h1>404 Not Found</h1><p>Acara dengan ID '$eventId' tidak ditemukan.</p>";
            exit;
        }

        $page_title = "Kelola Tipe Tiket untuk: " . htmlspecialchars($event['name']);
        ob_start();
        include_once __DIR__ . '/../../templates/admin/ticket_types/index.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/admin_layout.php';
    }
    
    public function createTicketTypeForm($eventId) {
        $ticketType = null;
        $eventStmt = $this->db->prepare("SELECT name FROM events WHERE id = ?");
        $eventStmt->execute([$eventId]);
        $event = $eventStmt->fetch(PDO::FETCH_ASSOC);

        if (!$event) {
            http_response_code(404);
            echo "<h1>404 Not Found</h1><p>Acara dengan ID '$eventId' tidak ditemukan.</p>";
            exit;
        }

        $page_title = "Buat Tipe Tiket Baru";
        ob_start();
        include_once __DIR__ . '/../../templates/admin/ticket_types/form.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/admin_layout.php';
    }

    public function editTicketTypeForm($ticketTypeId) {
        $stmt = $this->db->prepare("SELECT * FROM ticket_types WHERE id = ?");
        $stmt->execute([$ticketTypeId]);
        $ticketType = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$ticketType) {
            http_response_code(404);
            echo "<h1>404 Not Found</h1><p>Tipe tiket dengan ID '$ticketTypeId' tidak ditemukan.</p>";
            exit;
        }

        $eventId = $ticketType['event_id']; 
        $eventStmt = $this->db->prepare("SELECT name FROM events WHERE id = ?");
        $eventStmt->execute([$eventId]);
        $event = $eventStmt->fetch(PDO::FETCH_ASSOC);

        $page_title = "Edit Tipe Tiket";
        ob_start();
        include_once __DIR__ . '/../../templates/admin/ticket_types/form.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/admin_layout.php';
    }

    public function storeTicketType() {
        $query = "INSERT INTO ticket_types (event_id, name, price, capacity, available_from, available_until) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            $_POST['event_id'], $_POST['name'], $_POST['price'],
            $_POST['capacity'], $_POST['available_from'], $_POST['available_until']
        ]);
        $this->setFlashMessage('Tipe tiket baru berhasil dibuat.');
        header('Location: ' . BASE_URL . '/admin/events/' . $_POST['event_id'] . '/tickets');
        exit;
    }

    public function updateTicketType($id) {
        $query = "UPDATE ticket_types SET name = ?, price = ?, capacity = ?, available_from = ?, available_until = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            $_POST['name'], $_POST['price'], $_POST['capacity'],
            $_POST['available_from'], $_POST['available_until'], $id
        ]);
        $this->setFlashMessage('Tipe tiket berhasil diperbarui.');
        header('Location: ' . BASE_URL . '/admin/events/' . $_POST['event_id'] . '/tickets');
        exit;
    }

    public function deleteTicketType($id) {
        $stmt = $this->db->prepare("SELECT event_id FROM ticket_types WHERE id = ?");
        $stmt->execute([$id]);
        $ticketType = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($ticketType) {
            $eventId = $ticketType['event_id'];
            $this->db->prepare("DELETE FROM tickets WHERE ticket_type_id = ?")->execute([$id]);
            $this->db->prepare("DELETE FROM ticket_types WHERE id = ?")->execute([$id]);
            $this->setFlashMessage('Tipe tiket berhasil dihapus.', 'danger');
            header('Location: ' . BASE_URL . '/admin/events/' . $eventId . '/tickets');
        } else {
            $this->setFlashMessage('Gagal menghapus: Tipe tiket tidak ditemukan.', 'danger');
            header('Location: ' . BASE_URL . '/admin/events');
        }
        exit;
    }

    public function listRegistrations() {
        $registrationModel = new \App\Models\Registration($this->db);
        $registrations = $registrationModel->findAll();

        $page_title = "Kelola Pendaftaran";
        ob_start();
        include_once __DIR__ . '/../../templates/admin/registrations/index.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/admin_layout.php';
    }
}