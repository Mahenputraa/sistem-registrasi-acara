<?php
?>
<div class="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-slate-800 mb-2"><?= $ticketType ? 'Edit Tipe Tiket' : 'Buat Tipe Tiket Baru' ?></h2>
    <p class="text-slate-500 mb-6">Untuk Acara: <span class="font-semibold"><?= htmlspecialchars($event['name']) ?></span></p>
    
    <form action="<?= $ticketType ? BASE_URL . '/admin/tickets/update/' . $ticketType['id'] : BASE_URL . '/admin/tickets/store' ?>" method="POST" class="space-y-6">
        <input type="hidden" name="event_id" value="<?= $eventId ?>">
        
        <div>
            <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Tipe Tiket</label>
            <input type="text" id="name" name="name" value="<?= htmlspecialchars($ticketType['name'] ?? '') ?>" placeholder="Contoh: General Admission, VIP, Early Bird" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="price" class="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
                <input type="number" id="price" name="price" step="1000" min="0" value="<?= htmlspecialchars($ticketType['price'] ?? '') ?>" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required>
            </div>
            <div>
                <label for="capacity" class="block text-sm font-medium text-slate-700 mb-1">Kapasitas</label>
                <input type="number" id="capacity" name="capacity" min="1" value="<?= htmlspecialchars($ticketType['capacity'] ?? '') ?>" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="available_from" class="block text-sm font-medium text-slate-700 mb-1">Tersedia Mulai</label>
                <input type="datetime-local" id="available_from" name="available_from" value="<?= htmlspecialchars($ticketType ? date('Y-m-d\TH:i', strtotime($ticketType['available_from'])) : '') ?>" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required>
            </div>
            <div>
                <label for="available_until" class="block text-sm font-medium text-slate-700 mb-1">Tersedia Hingga</label>
                <input type="datetime-local" id="available_until" name="available_until" value="<?= htmlspecialchars($ticketType ? date('Y-m-d\TH:i', strtotime($ticketType['available_until'])) : '') ?>" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required>
            </div>
        </div>

        <div class="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200 mt-2">
            <a href="<?= BASE_URL ?>/admin/events/<?= $eventId ?>/tickets" class="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800">
                Batal
            </a>
            <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                Simpan Tipe Tiket
            </button>
        </div>
    </form>
</div>