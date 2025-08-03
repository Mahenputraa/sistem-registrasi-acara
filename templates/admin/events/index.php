<div class="bg-white p-8 rounded-xl shadow-lg">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-slate-800">Daftar Acara</h2>
        <a href="<?= BASE_URL ?>/admin/events/create" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm">Buat Acara Baru</a>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full table-auto">
            <thead>
                <tr class="bg-slate-100 text-slate-600 uppercase text-sm leading-normal">
                    <th class="py-3 px-6 text-left">ID</th>
                    <th class="py-3 px-6 text-left">Nama Acara</th>
                    <th class="py-3 px-6 text-left">Waktu Mulai</th>
                    <th class="py-3 px-6 text-center">Tiket</th>
                    <th class="py-3 px-6 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody class="text-slate-700 text-sm font-light">
                <?php foreach ($events as $event): ?>
                    <tr class="border-b border-slate-200 hover:bg-slate-50">
                        <td class="py-4 px-6 text-left font-medium"><?= htmlspecialchars($event['id']) ?></td>
                        <td class="py-4 px-6 text-left"><?= htmlspecialchars($event['name']) ?></td>
                        <td class="py-4 px-6 text-left"><?= date('d M Y, H:i', strtotime($event['start_time'])) ?></td>
                        <td class="py-4 px-6 text-center">
                            <a href="<?= BASE_URL ?>/admin/events/<?= $event['id'] ?>/tickets" class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-200">Kelola Tiket</a>
                        </td>
                        <td class="py-4 px-6 text-center">
                            <div class="flex item-center justify-center space-x-2">
                                <a href="<?= BASE_URL ?>/admin/events/edit/<?= $event['id'] ?>" class="p-2 rounded-md bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z"></path></svg>
                                </a>
                                <a href="<?= BASE_URL ?>/admin/events/delete/<?= $event['id'] ?>" onclick="return confirm('Apakah Anda yakin ingin menghapus acara ini? Ini akan menghapus semua tiket dan pendaftaran terkait.')" class="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </a>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>