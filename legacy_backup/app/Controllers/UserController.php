<?php
namespace App\Controllers;

use App\Config\Database;
use App\Models\Registration;
use PDO;

class UserController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function showMyTickets() {
        if (!isset($_SESSION['user_id'])) {
            header('Location: ' . BASE_URL . '/login');
            exit;
        }

        $registrationModel = new Registration($this->db);
        $registrations = $registrationModel->findByUserId($_SESSION['user_id']);

        $page_title = "Tiket Saya";
        ob_start();
        include_once __DIR__ . '/../../templates/user/tickets.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/main.php';
    }

    public function showTicketDetail($registrationId) {
        if (!isset($_SESSION['user_id'])) {
            header('Location: ' . BASE_URL . '/login');
            exit;
        }

        $registrationModel = new Registration($this->db);
        $registration = $registrationModel->findById($registrationId);

        // Keamanan: Pastikan tiket ini milik user yang sedang login
        if (!$registration || $registration['user_id'] != $_SESSION['user_id']) {
            http_response_code(403);
            echo "<h1>403 Forbidden</h1><p>Anda tidak memiliki akses ke tiket ini.</p>";
            exit;
        }

        $page_title = "Detail Tiket: " . htmlspecialchars($registration['event_name']);
        ob_start();
        include_once __DIR__ . '/../../templates/user/ticket_detail.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/main.php';
    }
}