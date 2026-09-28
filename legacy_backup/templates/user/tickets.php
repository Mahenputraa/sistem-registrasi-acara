<?php
?>
<div class="bg-white p-8 rounded-2xl shadow-lg">
    <h1 class="text-3xl font-bold text-slate-800 mb-6">Riwayat Pendaftaran Tiket Anda</h1>
    <div class="overflow-x-auto">
        <table class="w-full table-auto">
            <thead>
                <tr class="bg-slate-100 text-slate-600 uppercase text-sm leading-normal">
                    <th class="py-3 px-6 text-left">Nama Acara</th>
                    <th class="py-3 px-6 text-left">Tanggal Acara</th>
                    <th class="py-3 px-6 text-left">Tanggal Pesan</th>
                    <th class="py-3 px-6 text-right">Total Bayar</th>
                    <th class="py-3 px-6 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody class="text-slate-600 text-sm font-light">
                <?php if (empty($registrations)): ?>
                    <tr>
                        <td colspan="5" class="text-center py-6">Anda belum pernah mendaftar acara apapun.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($registrations as $reg): ?>
                        <tr class="border-b border-slate-200 hover:bg-slate-50">
                            <td class="py-4 px-6 text-left font-medium text-slate-800"><?= htmlspecialchars($reg['event_name']) ?></td>
                            <td class="py-4 px-6 text-left"><?= date('d F Y', strtotime($reg['start_time'])) ?></td>
                            <td class="py-4 px-6 text-left"><?= date('d F Y', strtotime($reg['order_date'])) ?></td>
                            <td class="py-4 px-6 text-right">Rp <?= number_format($reg['total_amount'], 0, ',', '.') ?></td>
                            <td class="py-4 px-6 text-center">
                                <a href="<?= BASE_URL ?>/registrations/<?= $reg['id'] ?>" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-semibold">Lihat Tiket</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
