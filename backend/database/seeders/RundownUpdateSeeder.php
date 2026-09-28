<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class RundownUpdateSeeder extends Seeder
{
    public function run(): void
    {
        $defaultRundowns = [
            1 => [
                ['time' => '08:30 - 09:00', 'title' => 'Registrasi & Morning Coffee', 'desc' => 'Scan QR Code tiket & networking pagi'],
                ['time' => '09:00 - 10:30', 'title' => 'Fundamental Machine Learning & LLM', 'desc' => 'Konsep transformer dan model generative modern'],
                ['time' => '10:30 - 12:00', 'title' => 'Hands-on Fine-Tuning Praktis', 'desc' => 'Latihan PyTorch & HuggingFace di Google Colab'],
                ['time' => '12:00 - 13:00', 'title' => 'Networking Lunch', 'desc' => 'Makan siang & diskusi santai bersama mentor'],
                ['time' => '13:00 - 15:30', 'title' => 'Deploy Model ke Cloud & Production', 'desc' => 'Optimasi inferensi dengan vLLM & Docker container'],
                ['time' => '15:30 - 16:30', 'title' => 'Q&A, Showcase & Penyerahan Sertifikat', 'desc' => 'Tanya jawab terbuka & foto bersama'],
            ],
            2 => [
                ['time' => '08:00 - 09:00', 'title' => 'Check-in Peserta & Welcome Pack', 'desc' => 'Pengambilan badge peserta & merchandise'],
                ['time' => '09:00 - 10:30', 'title' => 'Keynote: Masa Depan Web & React 19', 'desc' => 'Tren terbaru Server Actions dan React Compiler'],
                ['time' => '10:30 - 12:00', 'title' => 'Building Scalable Design Systems with Tailwind v4', 'desc' => 'Arsitektur komponen dan micro-frontends'],
                ['time' => '12:00 - 13:30', 'title' => 'Lunch Break & Expo Hall', 'desc' => 'Kunjungi booth sponsor dan komunitas teknologi'],
                ['time' => '13:30 - 16:00', 'title' => 'Lightning Talks & Deep-dive Workshops', 'desc' => '3 track paralel frontend, performance & backend-for-frontend'],
                ['time' => '16:00 - 17:00', 'title' => 'Closing Ceremony & Door Prize', 'desc' => 'Pengumuman pemenang challenge & networking bebas'],
            ],
            3 => [
                ['time' => '18:45 - 19:00', 'title' => 'Open Waiting Room & Audio/Video Check', 'desc' => 'Peserta bergabung via Zoom Webinar'],
                ['time' => '19:00 - 19:15', 'title' => 'Opening by Moderator', 'desc' => 'Pengantar sesi dan profil pembicara'],
                ['time' => '19:15 - 20:30', 'title' => 'Panel Discussion: Cloud Native & Observability', 'desc' => 'Studi kasus migrasi microservices & monitoring'],
                ['time' => '20:30 - 21:15', 'title' => 'Live Interactive Q&A Session', 'desc' => 'Tanya jawab langsung bersama audience'],
                ['time' => '21:15 - 21:30', 'title' => 'Wrap-up, Feedback & Link Sertifikat', 'desc' => 'Pengisian form evaluasi dan penutupan'],
            ],
        ];

        foreach ($defaultRundowns as $eventId => $rundown) {
            $event = Event::find($eventId);
            if ($event) {
                $event->update(['rundown' => $rundown]);
            }
        }
    }
}
