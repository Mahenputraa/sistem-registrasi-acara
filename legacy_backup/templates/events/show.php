<?php
?>
<div class="max-w-7xl mx-auto">
    <!-- Event Header -->
    <div class="relative bg-slate-900 rounded-2xl overflow-hidden mb-12 shadow-2xl">
        <div class="absolute inset-0">
            <img src="<?= htmlspecialchars($event['poster_url']) ?>" alt="Latar Belakang Acara" class="w-full h-full object-cover opacity-40">
        </div>
        <div class="relative px-6 py-20 md:px-12 md:py-28 text-white">
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight"><?= htmlspecialchars($event['name']) ?></h1>
            <p class="mt-4 text-xl text-indigo-200">Diselenggarakan oleh <span class="font-semibold"><?= htmlspecialchars($event['organizer_name']) ?></span></p>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Kolom Kiri: Deskripsi & Tiket -->
        <div class="lg:col-span-2 space-y-12">
            <!-- Deskripsi Acara -->
            <div class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-slate-800 mb-4">Tentang Acara Ini</h2>
                <div class="prose max-w-none text-slate-600">
                    <?= nl2br(htmlspecialchars($event['description'])) ?>
                </div>
            </div>

            <!-- Pilihan Tiket -->
            <div id="tiket" class="bg-white p-8 rounded-2xl shadow-lg">
                <h2 class="text-2xl font-bold text-slate-800 mb-6">Pilih Tiket & Daftar</h2>
                <div class="space-y-6">
                    <?php if ($ticketTypes->rowCount() > 0): ?>
                        <?php while ($row = $ticketTypes->fetch(PDO::FETCH_ASSOC)): ?>
                            <?php 
                                $isFull = ($row['sold'] >= $row['capacity']);
                                $availableSeats = $row['capacity'] - $row['sold'];
                            ?>
                            <div class="border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div class="flex-grow">
                                    <h3 class="text-xl font-bold text-slate-800"><?= htmlspecialchars($row['name']) ?></h3>
                                    <p class="text-lg font-semibold text-indigo-600 mt-1">Rp <?= number_format($row['price'], 0, ',', '.') ?></p>
                                </div>
                                <div class="text-center w-full md:w-auto">
                                    <?php if ($isFull): ?>
                                        <span class="px-6 py-3 rounded-lg bg-red-100 text-red-700 font-bold text-sm">PENUH</span>
                                    <?php else: ?>
                                        <p class="font-bold text-2xl text-green-600"><?= $availableSeats ?></p>
                                        <p class="text-xs text-slate-500">Sisa Tiket</p>
                                    <?php endif; ?>
                                </div>
                                <div class="w-full md:w-48">
                                    <form action="<?= BASE_URL ?>/events/<?= $event['id'] ?>/register" method="POST">
                                        <input type="hidden" name="ticket_type_id" value="<?= htmlspecialchars($row['id']) ?>">
                                        <div class="space-y-3">
                                            <input type="number" name="quantity" min="1" max="<?= $availableSeats ?>" placeholder="Jumlah" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" <?= $isFull ? 'disabled' : '' ?>>
                                            <button type="submit" <?= $isFull ? 'disabled' : '' ?> class="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed">
                                                Daftar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <div class="bg-slate-100 p-6 rounded-lg text-center">
                            <p class="text-slate-500">Tiket untuk acara ini belum tersedia atau sudah habis.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Kolom Kanan: Detail Ringkas -->
        <div class="lg:col-span-1">
            <div class="bg-white p-8 rounded-2xl shadow-lg sticky top-28">
                <h3 class="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-4">Detail Acara</h3>
                <ul class="space-y-4 text-slate-600">
                    <li class="flex items-start">
                        <svg class="w-6 h-6 text-indigo-500 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <div>
                            <p class="font-semibold">Tanggal & Waktu</p>
                            <p><?= date('l, d F Y', strtotime($event['start_time'])) ?></p>
                            <p><?= date('H:i', strtotime($event['start_time'])) ?> WIB - Selesai</p>
                        </div>
                    </li>
                    <li class="flex items-start">
                        <svg class="w-6 h-6 text-indigo-500 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <div>
                            <p class="font-semibold"><?= htmlspecialchars($venue->getName()) ?></p>
                            <p><?= $venue->getDisplayDetails() ?></p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>