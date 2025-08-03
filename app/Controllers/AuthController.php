<?php
namespace App\Controllers;

use App\Config\Database;
use App\Models\User;

class AuthController {
    public function showLogin() {
        require_once __DIR__ . '/../../templates/auth/login.php';
    }

    public function showRegister() {
        require_once __DIR__ . '/../../templates/auth/register.php';
    }

    public function login() {
        $database = new Database();
        $db = $database->getConnection();
        $user = new User($db);

        $userData = $user->findByEmail($_POST['email']);

        if ($userData && password_verify($_POST['password'], $userData['password'])) {
            $_SESSION['user_id'] = $userData['id'];
            $_SESSION['user_name'] = $userData['name'];
            $_SESSION['user_role'] = $userData['role'];
            // PERBAIKAN DI SINI
            header('Location: ' . BASE_URL . '/');
            exit;
        } else {
            // PERBAIKAN DI SINI
            header('Location: ' . BASE_URL . '/login?error=1');
            exit;
        }
    }

    public function register() {
        $database = new Database();
        $db = $database->getConnection();
        $user = new User($db);

        if ($user->findByEmail($_POST['email'])) {
            // PERBAIKAN DI SINI
            header('Location: ' . BASE_URL . '/register?error=exists');
            exit;
        }

        if ($user->create($_POST['name'], $_POST['email'], $_POST['password'])) {
            $newUser = $user->findByEmail($_POST['email']);
            $_SESSION['user_id'] = $newUser['id'];
            $_SESSION['user_name'] = $newUser['name'];
            $_SESSION['user_role'] = $newUser['role'];
            // PERBAIKAN DI SINI
            header('Location: ' . BASE_URL . '/');
            exit;
        } else {
            // PERBAIKAN DI SINI
            header('Location: ' . BASE_URL . '/register?error=failed');
            exit;
        }
    }

    public function logout() {
        session_unset();
        session_destroy();
        // PERBAIKAN DI SINI
        header('Location: ' . BASE_URL . '/login');
        exit;
    }
}