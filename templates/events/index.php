<?php
?>
<!-- Hero Section -->
<div class="relative bg-indigo-800 overflow-hidden rounded-2xl mb-12">
    <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="Latar Belakang Acara" class="w-full h-full object-cover opacity-30">
    </div>
    <div class="relative max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-white tracking-tight">Temukan & Hadiri Acara Teknologi Terbaik</h1>
        <p class="mt-6 text-lg md:text-xl text-indigo-200">Jelajahi workshop, konferensi, dan webinar untuk meningkatkan keahlian Anda ke level berikutnya.</p>
        <div class="mt-10">
            <a href="#acara" class="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105">
                Lihat Semua Acara
            </a>
        </div>
    </div>
</div>

<!-- Daftar Acara -->
<div id="acara" class="container mx-auto px-4 py-12">
    <header class="text-center mb-12">
        <h2 class="text-4xl font-bold text-slate-800">Acara Mendatang</h2>
        <p class="text-lg text-slate-500 mt-2">Jangan lewatkan kesempatan untuk belajar dari para ahli.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <?php while ($row = $events->fetch(PDO::FETCH_ASSOC)): ?>
            <?php extract($row); ?>
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
                <a href="<?= BASE_URL ?>/events/<?= htmlspecialchars($id) ?>" class="block">
                    <div class="relative">
                        <img src="<?= htmlspecialchars($poster_url) ?>" alt="Poster <?= htmlspecialchars($name) ?>" class="w-full h-56 object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div class="absolute bottom-4 left-4">
                            <h3 class="text-2xl font-bold text-white"><?= htmlspecialchars($name) ?></h3>
                            <p class="text-sm text-indigo-200 font-medium"><?= htmlspecialchars($venue_name) ?></p>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-slate-600 text-sm h-20 overflow-hidden"><?= htmlspecialchars($description) ?></p>
                        <div class="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                            <div class="text-sm font-medium text-slate-500">
                                <span class="font-bold text-indigo-600"><?= date('d M Y', strtotime($start_time)) ?></span>
                            </div>
                            <span class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">Lihat Detail &rarr;</span>
                        </div>
                    </div>
                </a>
            </div>
        <?php endwhile; ?>
    </div>
</div>