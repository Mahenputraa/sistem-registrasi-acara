# Acara Tech - Sistem Registrasi Acara & Manajemen E-Tiket (Rework v2.0)

Aplikasi manajemen acara, registrasi peserta, dan penerbitan e-tiket modern dengan validasi kode QR digital. Direkayasa ulang (*reworked*) dari sistem lama menjadi arsitektur terpisah (*decoupled*) berbasis **Laravel 12 REST API**, **PostgreSQL**, dan **Vite + React SPA**.

---

## 🚀 Arsitektur & Teknologi

```
sistem-registrasi-acara/
├── backend/            # Laravel 12 RESTful API + PostgreSQL + Laravel Sanctum
├── frontend/           # Vite + React 19 + Tailwind CSS + Framer Motion + QR Generator
└── legacy_backup/      # Arsip aman kode PHP native lama
```

### Backend (`/backend`)
- **Framework**: Laravel 12 (PHP 8.4)
- **Database**: PostgreSQL 16 (Database: `sistem_registrasi_acara`)
- **Autentikasi**: Laravel Sanctum (Bearer Token)
- **Keamanan Transaksi**: *Pessimistic Locking* (`lockForUpdate()`) di PostgreSQL untuk mencegah *overselling* kuota tiket
- **Fitur API**:
  - Autentikasi Pengguna & Admin (`/api/auth/*`)
  - Katalog & Pencarian Acara Real-time (`/api/events`)
  - Pemesanan Tiket Multi-Peserta (`/api/registrations`)
  - Tiket Pengguna (`/api/my-tickets`)
  - Scanner Validasi Check-In Tiket (`/api/check-in`)
  - Manajemen Acara & Venue (`/api/events`, `/api/venues`)

### Frontend (`/frontend`)
- **Tooling**: Vite + React 19
- **Desain & Gaya**: Tailwind CSS, Glassmorphism, Google Fonts (*Plus Jakarta Sans* & *Space Grotesk*)
- **Animasi**: Framer Motion (Transisi mikro pada tombol, modal dialog, dan kartu acara)
- **Komponen Modern**: Dialog Modal, Badge status, Card glassmorphism, Sonner Toasts
- **Fitur Interaktif**:
  - Kartu Acara dengan filter kategori (*Tatap Muka* & *Online*)
  - Modal Pemesanan Tiket Multi-tier (General, VIP, Early Bird)
  - Formulir peserta dinamis sesuai jumlah tiket
  - Perayaan konfeti visual (*Canvas Confetti*) saat checkout berhasil
  - Kartu E-Tiket Digital bergaya *Boarding Pass* dengan kode QR SVG aktif (`qrcode.react`)
  - Modal Scanner Check-In untuk panitia/admin dengan deteksi tiket duplikat
  - Admin Event Dashboard untuk membuat dan mengelola acara

---

## 🔑 Akun Uji Coba (Demo Quick Login)

Tersedia tombol *quick-fill* instan di dalam Modal Login:

| Peran | Email | Kata Sandi | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@acara.com` | `password` | Kelola Acara, Tambah Venue, Scanner Check-In QR |
| **User** | `budi@user.com` | `password` | Cari Acara, Beli Tiket, Lihat E-Tiket QR Saya |

---

## 🛠️ Cara Menjalankan Proyek Secara Lokal

### 1. Menjalankan Backend (Laravel 12 API)
Buka terminal pertama:
```bash
cd backend
php artisan serve --port=8000
```
API akan berjalan di `http://127.0.0.1:8000`.

### 2. Menjalankan Frontend (Vite + React)
Buka terminal kedua:
```bash
cd frontend
npm run dev
```
Buka browser Anda di `http://localhost:5173`.

---

## 🛡️ Database & Migrasi (Opsional)
Jika ingin me-reset database PostgreSQL:
```bash
cd backend
php artisan migrate:fresh --seed
```
Koneksi PostgreSQL dikonfigurasi pada `backend/.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sistem_registrasi_acara
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_SSLMODE=disable
```
