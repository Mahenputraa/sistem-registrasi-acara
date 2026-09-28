<?php
// Helper function to check if the current link is active
function isActive($path) {
    $current_path = strtok($_SERVER['REQUEST_URI'], '?');
    return strpos($current_path, $path) !== false;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($page_title) ? htmlspecialchars($page_title) : 'Admin Panel' ?> - AcaraTech</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style> 
        body { font-family: 'Inter', sans-serif; } 
        .sidebar-link {
            display: flex;
            align-items: center;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease-in-out;
            font-weight: 500;
        }
        .sidebar-link:hover {
            background-color: #374151; /* gray-700 */
        }
        .sidebar-link.active {
            background-color: #4f46e5; /* indigo-600 */
            color: white;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-slate-100">
    <div class="flex h-screen bg-slate-100">
        <!-- Sidebar -->
        <div class="w-64 bg-gray-900 text-gray-300 p-5 flex flex-col">
            <div class="flex items-center space-x-2 mb-10">
                <div class="p-2 bg-indigo-600 rounded-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                </div>
                <h1 class="text-2xl font-bold text-white">Admin Panel</h1>
            </div>
            <nav class="flex-grow">
                <a href="<?= BASE_URL ?>/admin/dashboard" class="sidebar-link <?= isActive('/admin/dashboard') ? 'active' : '' ?>">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    Dashboard
                </a>
                <a href="<?= BASE_URL ?>/admin/events" class="sidebar-link mt-2 <?= isActive('/admin/events') ? 'active' : '' ?>">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Kelola Acara
                </a>
                <a href="<?= BASE_URL ?>/admin/registrations" class="sidebar-link mt-2 <?= isActive('/admin/registrations') ? 'active' : '' ?>">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    Pendaftaran
                </a>
            </nav>
        </div>
        
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="flex justify-between items-center p-4 bg-white border-b border-slate-200">
                <div>
                    <h2 class="text-xl font-semibold text-slate-700"><?= htmlspecialchars($page_title) ?></h2>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="<?= BASE_URL ?>/" class="text-indigo-600 font-medium hover:underline" target="_blank">Lihat Situs</a>
                    <a href="<?= BASE_URL ?>/logout" class="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all">Logout</a>
                </div>
            </header>
            
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
                <?php
                if (isset($_SESSION['flash_message'])) {
                    $message = $_SESSION['flash_message'];
                    $color = $message['type'] === 'success' ? 'green' : 'red';
                    echo "<div class='bg-{$color}-100 border-l-4 border-{$color}-500 text-{$color}-700 p-4 mb-6 rounded-r-lg' role='alert'>";
                    echo "<p class='font-bold'>" . ($message['type'] === 'success' ? 'Sukses' : 'Error') . "</p>";
                    echo "<p>" . htmlspecialchars($message['message']) . "</p>";
                    echo "</div>";
                    unset($_SESSION['flash_message']);
                }
                ?>
                <?= $content ?? '' ?>
            </main>
        </div>
    </div>
</body>
</html>