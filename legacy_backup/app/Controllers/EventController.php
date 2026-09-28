<?php
namespace App\Controllers;

use App\Config\Database;
use App\Models\Event;
use App\Models\TicketType;
use App\Models\VenueFactory;
use App\Models\Registration;
use App\Models\Ticket;
use PDO;

class EventController {
    public function index() {
        $database = new Database();
        $db = $database->getConnection();
        $event = new Event($db);
        $events = $event->readAll();
        
        $page_title = "Daftar Acara";
        ob_start();
        include_once __DIR__ . '/../../templates/events/index.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/main.php';
    }

    public function show($id) {
        $database = new Database();
        $db = $database->getConnection();
        
        $eventModel = new Event($db);
        $event = $eventModel->readOne($id);

        if (!$event) {
            http_response_code(404);
            echo "<h1>404 Not Found</h1><p>Acara tidak ditemukan.</p>";
            exit;
        }
        
        $venue = VenueFactory::create($event);

        $ticketTypeModel = new TicketType($db);
        $ticketTypes = $ticketTypeModel->findByEventId($id);

        $page_title = "Detail Acara: " . htmlspecialchars($event['name']);
        ob_start();
        include_once __DIR__ . '/../../templates/events/show.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/main.php';
    }

    public function register($eventId) {
        if (!isset($_SESSION['user_id'])) {
            // PERBAIKAN DI SINI
            header('Location: ' . BASE_URL . '/login');
            exit;
        }

        $database = new Database();
        $db = $database->getConnection();
        
        $ticketTypeId = $_POST['ticket_type_id'] ?? null;
        $quantity = $_POST['quantity'] ?? 0;
        $userId = $_SESSION['user_id'];
        $userName = $_SESSION['user_name'];

        if (!$ticketTypeId || $quantity <= 0) {
            header('Location: ' . BASE_URL . '/events/' . $eventId . '?error=invalid_input');
            exit;
        }

        $stmt = $db->prepare("SELECT * FROM ticket_types WHERE id = ?");
        $stmt->execute([$ticketTypeId]);
        $ticketType = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$ticketType) {
            header('Location: ' . BASE_URL . '/events/' . $eventId . '?error=not_found');
            exit;
        }
        
        $totalAmount = $ticketType['price'] * $quantity;

        $db->beginTransaction();
        try {
            $registrationModel = new Registration($db);
            $registrationId = $registrationModel->create($userId, $eventId, $totalAmount);

            if (!$registrationId) {
                throw new \Exception("Gagal membuat registrasi.");
            }

            $ticketModel = new Ticket($db);
            for ($i = 0; $i < $quantity; $i++) {
                if (!$ticketModel->create($registrationId, $ticketTypeId, $userName)) {
                     throw new \Exception("Gagal membuat tiket.");
                }
            }

            $db->commit();
            
            header('Location: ' . BASE_URL . '/events/ticket/success?reg_id=' . $registrationId);
            exit;

        } catch (\Exception $e) {
            $db->rollBack();
            header('Location: ' . BASE_URL . '/events/' . $eventId . '?error=processing_failed');
            exit;
        }
    }

    public function showTicketSuccess() {
        $page_title = "Pendaftaran Berhasil";
        ob_start();
        include_once __DIR__ . '/../../templates/events/ticket.php';
        $content = ob_get_clean();
        include_once __DIR__ . '/../../templates/layouts/main.php';
    }
}