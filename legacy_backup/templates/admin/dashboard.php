<?php
?>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Card Total Acara -->
    <div class="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div class="p-3 bg-indigo-100 rounded-full">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Total Acara</p>
            <p class="text-3xl font-bold text-gray-800"><?= $data['event_count'] ?></p>
        </div>
    </div>
    <!-- Card Total Pengguna -->
    <div class="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Total Pengguna</p>
            <p class="text-3xl font-bold text-gray-800"><?= $data['user_count'] ?></p>
        </div>
    </div>
    <!-- Card Total Pendaftaran -->
    <div class="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div class="p-3 bg-purple-100 rounded-full">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Total Pendaftaran</p>
            <p class="text-3xl font-bold text-gray-800"><?= $data['registration_count'] ?></p>
        </div>
    </div>
</div>