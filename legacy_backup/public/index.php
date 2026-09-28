<?php
session_start();

require_once __DIR__ . '/../vendor/autoload.php';

define('BASE_URL', rtrim(dirname($_SERVER['SCRIPT_NAME']), '/'));

$request_method = $_SERVER['REQUEST_METHOD'];

$request_uri = strtok($_SERVER['REQUEST_URI'], '?');

$script_dir = dirname($_SERVER['SCRIPT_NAME']);
$script_dir = ($script_dir === '/' || $script_dir === '\\') ? '' : $script_dir;

if (strpos($request_uri, $script_dir) === 0) {
    $path = substr($request_uri, strlen($script_dir));
} else {
    $path = $request_uri;
}

if (empty($path) || $path[0] !== '/') {
    $path = '/' . $path;
}

// --- Proteksi Rute Admin ---
if (strpos($path, '/admin') === 0) {
    if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        echo "<h1>403 Forbidden</h1><p>Anda tidak memiliki hak akses ke halaman ini.</p>";
        exit;
    }
}

$routes = require __DIR__ . '/../routes/web.php';

$matched = false;
if (isset($routes[$request_method])) {
    foreach ($routes[$request_method] as $route => $handler) {
        $pattern = "#^" . $route . "$#";
        if (preg_match($pattern, $path, $matches)) {
            array_shift($matches);
            
            $controllerName = $handler[0];
            $methodName = $handler[1];
            
            $controller = new $controllerName();
            call_user_func_array([$controller, $methodName], $matches);
            
            $matched = true;
            break;
        }
    }
}

if (!$matched) {
    http_response_code(404);
    echo "<h1>404 Not Found</h1><p>Halaman yang Anda cari tidak ditemukan.</p>";
}