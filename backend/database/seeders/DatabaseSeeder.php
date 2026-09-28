<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Registration;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@acara.com'],
            [
                'name' => 'Admin Acara',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $user = User::firstOrCreate(
            ['email' => 'budi@user.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        // 2. Venues
        $venue1 = Venue::create([
            'name' => 'Tech Hub Jakarta',
            'type' => 'physical',
            'address' => 'Jl. Gatot Subroto No. 42, Kuningan Barat, Jakarta Selatan',
            'platform' => null,
            'url' => null,
        ]);

        $venue2 = Venue::create([
            'name' => 'Inovasi Center Bandung',
            'type' => 'physical',
            'address' => 'Jl. Asia Afrika No. 8, Braga, Bandung',
            'platform' => null,
            'url' => null,
        ]);

        $venue3 = Venue::create([
            'name' => 'Sesi Online Zoom & YouTube Live',
            'type' => 'online',
            'address' => null,
            'platform' => 'Zoom Video Webinar',
            'url' => 'https://zoom.us/j/9876543210',
        ]);

        // 3. Events
        $event1 = Event::create([
            'name' => 'Workshop Machine Learning & AI Generatif 2026',
            'description' => 'Pelajari konsep dasar machine learning hingga implementasi Large Language Models (LLM) dan fine-tuning praktis dengan Python, PyTorch, dan cloud deployment.',
            'start_time' => now()->addDays(7)->setTime(9, 0),
            'end_time' => now()->addDays(7)->setTime(17, 0),
            'venue_id' => $venue1->id,
            'organizer_id' => $admin->id,
            'poster_url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
            'rundown' => [
                ['time' => '08:30 - 09:00', 'title' => 'Registrasi & Morning Coffee', 'desc' => 'Scan QR Code tiket & networking'],
                ['time' => '09:00 - 10:30', 'title' => 'Fundamental Machine Learning & LLM', 'desc' => 'Konsep transformer dan model generative modern'],
                ['time' => '10:30 - 12:00', 'title' => 'Hands-on Fine-Tuning Praktis', 'desc' => 'Latihan PyTorch & HuggingFace di Google Colab'],
                ['time' => '12:00 - 13:00', 'title' => 'Networking Lunch', 'desc' => 'Makan siang & diskusi santai bersama mentor'],
                ['time' => '13:00 - 15:30', 'title' => 'Deploy Model ke Cloud & Production', 'desc' => 'Optimasi inferensi dengan vLLM & Docker container'],
                ['time' => '15:30 - 16:30', 'title' => 'Q&A, Showcase & Penyerahan Sertifikat', 'desc' => 'Tanya jawab terbuka & foto bersama'],
            ],
        ]);

        $event2 = Event::create([
            'name' => 'React & Next.js Indonesia Conference 2026',
            'description' => 'Konferensi tahunan terbesar developer frontend dan fullstack web di Indonesia. Menghadirkan pembicara industri global membahas Server Components, Vite, Tailwind, dan Micro-frontends.',
            'start_time' => now()->addDays(20)->setTime(8, 30),
            'end_time' => now()->addDays(21)->setTime(18, 0),
            'venue_id' => $venue2->id,
            'organizer_id' => $admin->id,
            'poster_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
            'rundown' => [
                ['time' => '08:00 - 09:00', 'title' => 'Check-in Peserta & Welcome Pack', 'desc' => 'Pengambilan badge peserta & merchandise'],
                ['time' => '09:00 - 10:30', 'title' => 'Keynote: Masa Depan Web & React 19', 'desc' => 'Tren terbaru Server Actions dan React Compiler'],
                ['time' => '10:30 - 12:00', 'title' => 'Building Scalable Design Systems with Tailwind v4', 'desc' => 'Arsitektur komponen dan micro-frontends'],
                ['time' => '12:00 - 13:30', 'title' => 'Lunch Break & Expo Hall', 'desc' => 'Kunjungi booth sponsor dan komunitas teknologi'],
                ['time' => '13:30 - 16:00', 'title' => 'Lightning Talks & Deep-dive Workshops', 'desc' => '3 track paralel frontend, performance & backend-for-frontend'],
                ['time' => '16:00 - 17:00', 'title' => 'Closing Ceremony & Door Prize', 'desc' => 'Pengumuman pemenang challenge & networking bebas'],
            ],
        ]);

        $event3 = Event::create([
            'name' => 'Webinar: Tren Arsitektur Cloud & DevOps Modern',
            'description' => 'Diskusi panel interaktif bersama para Principal Architect tentang Kubernetes, Serverless, Observability, dan CI/CD pipeline automation.',
            'start_time' => now()->addDays(14)->setTime(19, 0),
            'end_time' => now()->addDays(14)->setTime(21, 30),
            'venue_id' => $venue3->id,
            'organizer_id' => $admin->id,
            'poster_url' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
            'rundown' => [
                ['time' => '18:45 - 19:00', 'title' => 'Open Waiting Room & Audio/Video Check', 'desc' => 'Peserta bergabung via Zoom Webinar'],
                ['time' => '19:00 - 19:15', 'title' => 'Opening by Moderator', 'desc' => 'Pengantar sesi dan profil pembicara'],
                ['time' => '19:15 - 20:30', 'title' => 'Panel Discussion: Cloud Native & Observability', 'desc' => 'Studi kasus migrasi microservices & monitoring'],
                ['time' => '20:30 - 21:15', 'title' => 'Live Interactive Q&A Session', 'desc' => 'Tanya jawab langsung bersama audience'],
                ['time' => '21:15 - 21:30', 'title' => 'Wrap-up, Feedback & Link Sertifikat', 'desc' => 'Pengisian form evaluasi dan penutupan'],
            ],
        ]);

        // 4. Ticket Types
        $ticketType1_1 = TicketType::create([
            'event_id' => $event1->id,
            'name' => 'General Admission',
            'price' => 150000,
            'capacity' => 100,
            'available_from' => now()->subDays(5),
            'available_until' => now()->addDays(6),
        ]);

        $ticketType1_2 = TicketType::create([
            'event_id' => $event1->id,
            'name' => 'VIP + Mentoring Session',
            'price' => 350000,
            'capacity' => 25,
            'available_from' => now()->subDays(5),
            'available_until' => now()->addDays(6),
        ]);

        $ticketType2_1 = TicketType::create([
            'event_id' => $event2->id,
            'name' => 'Early Bird (2 Days Pass)',
            'price' => 450000,
            'capacity' => 50,
            'available_from' => now()->subDays(10),
            'available_until' => now()->addDays(10),
        ]);

        $ticketType2_2 = TicketType::create([
            'event_id' => $event2->id,
            'name' => 'Regular Pass',
            'price' => 750000,
            'capacity' => 150,
            'available_from' => now()->subDays(5),
            'available_until' => now()->addDays(19),
        ]);

        $ticketType3_1 = TicketType::create([
            'event_id' => $event3->id,
            'name' => 'Free Access Pass',
            'price' => 0,
            'capacity' => 500,
            'available_from' => now()->subDays(3),
            'available_until' => now()->addDays(13),
        ]);

        // 5. Sample Registration & Ticket for Budi
        $registration = Registration::create([
            'registration_number' => 'REG-'.date('Ymd').'-0001',
            'user_id' => $user->id,
            'event_id' => $event1->id,
            'total_amount' => 150000,
            'payment_status' => 'paid',
            'payment_method' => 'QRIS',
        ]);

        Ticket::create([
            'registration_id' => $registration->id,
            'ticket_type_id' => $ticketType1_1->id,
            'attendee_name' => 'Budi Santoso',
            'attendee_email' => 'budi@user.com',
            'ticket_code' => 'TKT-'.strtoupper(Str::random(10)),
            'status' => 'active',
            'checked_in_at' => null,
        ]);
    }
}
