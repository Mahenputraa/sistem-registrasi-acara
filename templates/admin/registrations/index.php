<?php
?>
<div class="bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">Daftar Semua Pendaftaran</h2>
    <div class="overflow-x-auto">
        <table class="w-full table-auto">
            <thead>
                <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th class="py-3 px-6 text-left">ID Reg.</th>
                    <th class="py-3 px-6 text-left">Nama Pengguna</th>
                    <th class="py-3 px-6 text-left">Nama Acara</th>
                    <th class="py-3 px-6 text-left">Tanggal Pesan</th>
                    <th class="py-3 px-6 text-right">Total</th>
                    <th class="py-3 px-6 text-center">Status</th>
                </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
                <?php foreach ($registrations as $reg): ?>
                    <tr class="border-b border-gray-200 hover:bg-gray-100">
                        <td class="py-3 px-6 text-left"><?= htmlspecialchars($reg['id']) ?></td>
                        <td class="py-3 px-6 text-left"><?= htmlspecialchars($reg['user_name']) ?></td>
                        <td class="py-3 px-6 text-left"><?= htmlspecialchars($reg['event_name']) ?></td>
                        <td class="py-3 px-6 text-left"><?= date('d M Y, H:i', strtotime($reg['order_date'])) ?></td>
                        <td class="py-3 px-6 text-right">Rp <?= number_format($reg['total_amount'], 0, ',', '.') ?></td>
                        <td class="py-3 px-6 text-center">
                            <span class="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs"><?= htmlspecialchars($reg['payment_status']) ?></span>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>