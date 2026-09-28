<?php
?>
<div class="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-slate-800 mb-6"><?= $event ? 'Edit Acara' : 'Buat Acara Baru' ?></h2>
    
    <form action="<?= $event ? BASE_URL . '/admin/events/update/' . $event['id'] : BASE_URL . '/admin/events/store' ?>" method="POST" class="space-y-6">
        <div>
            <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Acara</label>
            <input type="text" id="name" name="name" value="<?= htmlspecialchars($event['name'] ?? '') ?>" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required>
        </div>
        
        <div>
            <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea id="description" name="description" rows="5" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required><?= htmlspecialchars($event['description'] ?? '') ?></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="start_time" class="block text-sm font-medium text-slate-700 mb-1">Waktu Mulai</label>
                <input type="datetime-local" id="start_time" name="start_time" value="<?= htmlspecialchars($event ? date('Y-m-d\TH:i', strtotime($event['start_time'])) : '') ?>" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required>
            </div>
            <div>
                <label for="end_time" class="block text-sm font-medium text-slate-700 mb-1">Waktu Selesai</label>
                <input type="datetime-local" id="end_time" name="end_time" value="<?= htmlspecialchars($event ? date('Y-m-d\TH:i', strtotime($event['end_time'])) : '') ?>" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="venue_id" class="block text-sm font-medium text-slate-700 mb-1">Venue</label>
                <select id="venue_id" name="venue_id" class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white" required>
                    <?php foreach ($venues as $venue): ?>
                        <option value="<?= $venue['id'] ?>" <?= isset($event) && $event['venue_id'] == $venue['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($venue['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div>
                <label for="organizer_id" class="block text-sm font-medium text-slate-700 mb-1">Penyelenggara</label>
                <select id="organizer_id" name="organizer_id" class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white" required>
                     <?php foreach ($organizers as $organizer): ?>
                        <option value="<?= $organizer['id'] ?>" <?= isset($event) && $event['organizer_id'] == $organizer['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($organizer['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div>
            <label for="poster_url" class="block text-sm font-medium text-slate-700 mb-1">URL Poster</label>
            <input type="url" id="poster_url" name="poster_url" value="<?= htmlspecialchars($event['poster_url'] ?? '') ?>" placeholder="Biarkan kosong untuk menggunakan poster default" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
        </div>

        <div class="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200 mt-2">
            <a href="<?= BASE_URL ?>/admin/events" class="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800">
                Batal
            </a>
            <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                Simpan
            </button>
        </div>
    </form>
</div>