<?php
?>
<div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
    <div class="bg-indigo-600 text-white p-6 text-center">
        <h1 class="text-3xl font-bold">E-TIKET ACARA</h1>
        <p class="text-indigo-200 mt-1">Ini adalah bukti pendaftaran Anda yang sah.</p>
    </div>
    <div class="p-8">
        <div class="mb-6 pb-6 border-b border-slate-200">
            <p class="text-sm text-slate-500 uppercase font-semibold">Nama Acara</p>
            <h2 class="text-4xl font-bold text-slate-800 mt-1"><?= htmlspecialchars($registration['event_name']) ?></h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <p class="text-sm text-slate-500 uppercase font-semibold">Tanggal & Waktu</p>
                <p class="text-lg font-medium text-slate-700 mt-1"><?= date('l, d F Y', strtotime($registration['start_time'])) ?></p>
                <p class="text-lg font-medium text-slate-700"><?= date('H:i', strtotime($registration['start_time'])) ?> WIB</p>
            </div>
            <div>
                <p class="text-sm text-slate-500 uppercase font-semibold">Lokasi</p>
                <p class="text-lg font-medium text-slate-700 mt-1"><?= htmlspecialchars($registration['venue_name']) ?></p>
            </div>
            <div>
                <p class="text-sm text-slate-500 uppercase font-semibold">Peserta</p>
                <p class="text-lg font-medium text-slate-700 mt-1"><?= htmlspecialchars($registration['attendee_name']) ?></p>
            </div>
            <div>
                <p class="text-sm text-slate-500 uppercase font-semibold">Tipe Tiket</p>
                <p class="text-lg font-medium text-slate-700 mt-1"><?= htmlspecialchars($registration['ticket_type_name']) ?></p>
            </div>
        </div>
        <div class="mt-8 pt-8 border-t border-slate-200 text-center">
            <p class="text-sm text-slate-500 uppercase font-semibold">Kode Tiket Anda</p>
            <p class="font-mono text-3xl bg-slate-100 text-indigo-600 py-3 px-4 inline-block rounded-lg mt-2 tracking-widest"><?= htmlspecialchars($registration['ticket_code']) ?></p>
        </div>
    </div>
</div>
<div class="text-center mt-8">
    <a href="<?= BASE_URL ?>/my-tickets" class="text-indigo-600 hover:underline">&larr; Kembali ke Daftar Tiket Saya</a>
</div>