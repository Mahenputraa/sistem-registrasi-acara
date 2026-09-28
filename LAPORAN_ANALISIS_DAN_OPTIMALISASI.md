# 📊 Laporan Analisis Arsitektur & Rencana Optimalisasi Proyek "Acara Tech"

> **Tanggal Analisis**: 23 September 2026  
> **Target Proyek**: `sistem-registrasi-acara` (Acara Tech)  
> **Teknologi**: React 19, Vite 8, Tailwind CSS v4, Laravel 12, PostgreSQL 16, Laravel Sanctum  
> **Penyusun**: Technical Architecture & Optimization Review  

---

## 📑 Daftar Isi
1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Pemetaan Arsitektur Sistem Saat Ini](#2-pemetaan-arsitektur-sistem-saat-ini)
3. [Analisis Mendalam Sisi Frontend](#3-analisis-mendalam-sisi-frontend)
4. [Analisis Mendalam Sisi Backend & API](#4-analisis-mendalam-sisi-backend--api)
5. [Analisis Database & Indexing (PostgreSQL)](#5-analisis-database--indexing-postgresql)
6. [Analisis Keamanan & Otorisasi](#6-analisis-keamanan--otorisasi)
7. [Kualitas Kode, Pengujian & Developer Experience](#7-kualitas-kode-pengujian--developer-experience)
8. [Matriks Prioritas & Dampak (Impact vs Effort)](#8-matriks-prioritas--dampak-impact-vs-effort)
9. [Peta Jalan Optimalisasi Bertahap (Actionable Roadmap)](#9-peta-jalan-optimalisasi-bertahap-actionable-roadmap)
10. [Target Metrik & Kriteria Keberhasilan (KPI)](#10-target-metrik--kriteria-keberhasilan-kpi)

---

## 1. Ringkasan Eksekutif

Aplikasi **Acara Tech** merupakan platform registrasi acara, reservasi tiket berbasis tier/kategori, e-tiket boarding pass, dan validasi QR Code check-in berbasis web. Sistem telah memiliki fondasi fungsional yang baik, termasuk transaksi pemesanan tiket dengan *pessimistic lock*, dual tema modern (*Dark & Light Mode*), serta modal interaktif untuk admin dan pengguna.

Namun, evaluasi mendalam menemukan sejumlah **masalah performa tersembunyi, celah konkurensi, dan utang teknis (*technical debts*)** yang akan menghambat skalabilitas jika aplikasi menerima lonjakan pengguna (*traffic spike*), di antaranya:
- **Ukuran bundle JavaScript frontend mencapai 671 kB dalam 1 berkas tunggal** akibat ketiadaan *code-splitting*.
- **Hidden N+1 Database Query** pada accessor model `TicketType`, mengeksekusi puluhan query SQL tambahan pada setiap load halaman acara.
- **Potensi Race Condition Check-in** di *gate* akibat ketiadaan transaksi/kunci atomik saat membaca dan memperbarui tiket.
- **Ketiadaan index pada Foreign Keys** PostgreSQL yang berisiko memicu *Sequential Scan* lambat saat data membesar.
- **Celah otorisasi** pada endpoint manipulasi acara yang belum dilindungi oleh *Laravel Policy*.

---

## 2. Pemetaan Arsitektur Sistem Saat Ini

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19 + Vite 8)                    │
│                                                                        │
│   [App.jsx] (Monolithic Bundle: 671 kB)                                │
│       ├── Public: HomePage, EventDetailPage                            │
│       ├── Protected: MyTicketsPage (QR Code, Print Tickets)            │
│       └── Admin: AdminEventsPage (Event & Tier CRUD, Venue CRUD)       │
│                                                                        │
│   State & Layer API:                                                   │
│       • Axios Client (`/api` Proxy)                                    │
│       • useEvents (Spam API per-keystroke, tanpa Debounce)             │
│       • Ketiadaan React Error Boundary                                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP JSON REST API
┌───────────────────────────────────▼────────────────────────────────────┐
│                        BACKEND (Laravel 12 REST API)                   │
│                                                                        │
│   Routing: `routes/api.php`                                            │
│       ├── Public: /events, /events/{id}, /venues, /auth/login          │
│       └── Sanctum Auth: /registrations, /check-in, /admin/events       │
│                                                                        │
│   Controllers & Services:                                              │
│       • EventService (Create / Update event + tiers)                   │
│       • BookingService (DB::transaction + lockForUpdate)               │
│       • CheckInService (Non-atomic check-in, Race Condition Risk)      │
│                                                                        │
│   Eloquent Models:                                                     │
│       • TicketType (Hidden N+1: $appends 'sold_count')                 │
│       • Event (Query all tanpa paginasi)                               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ PostgreSQL Connection (Port 5432)
┌───────────────────────────────────▼────────────────────────────────────┐
│                        DATABASE (PostgreSQL 16)                        │
│                                                                        │
│   Tabel: users, events, venues, ticket_types, registrations, tickets   │
│   Catatan Index:                                                       │
│       • Foreign keys belum memiliki index B-tree eksplisit             │
│       • Kolom `events.start_time` & `tickets.status` belum ter-index   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Analisis Mendalam Sisi Frontend

### 3.1. Ukuran Bundle & Ketiadaan Code-Splitting (Kritis)
- **Status Build Saat Ini**:
  ```
  dist/index.html                   0.65 kB │ gzip:   0.38 kB
  dist/assets/index-Bd2Ai8gV.css   70.81 kB │ gzip:  11.65 kB
  dist/assets/index-5n3jpa7W.js   671.13 kB │ gzip: 201.67 kB
  (!) Some chunks are larger than 500 kB after minification.
  ```
- **Akar Masalah**: Seluruh halaman (`AdminEventsPage`, `MyTicketsPage`, `EventDetailPage`) dan library pihak ketiga (`framer-motion`, `qrcode.react`, `canvas-confetti`, `lucide-react`) dimuat sekaligus di `App.jsx`.
- **Rekomendasi Perbaikan**:
  1. Terapkan `React.lazy()` dan `<Suspense fallback={<PageSkeleton />}>` untuk memecah rute halaman.
  2. Konfigurasi `manualChunks` pada `vite.config.js` untuk memisahkan vendor (*vendor chunking*):
     - `vendor-react`: `react`, `react-dom`, `react-router-dom`
     - `vendor-ui`: `framer-motion`, `lucide-react`, `sonner`
     - `vendor-utils`: `qrcode.react`, `canvas-confetti`, `axios`
  3. **Target**: Ukuran chunk utama berkurang dari **671 kB menjadi < 150 kB**.

### 3.2. Input Pencarian Real-Time Tanpa Debounce (Tinggi)
- **Lokasi Kode**: `frontend/src/features/home/components/SearchFilterToolbar.jsx` dan `frontend/src/hooks/useEvents.js`.
- **Akar Masalah**: State `search` diupdate pada event `onChange`, yang langsung memicu pemanggilan API `GET /api/events?search=...` tanpa jeda.
- **Dampak**: Mengetik kata dengan 10 huruf mengirimkan 10 permintaan HTTP berturut-turut. Ini membebani server dan dapat memicu kondisi *race condition* (respons permintaan lama tiba setelah respons baru).
- **Rekomendasi Perbaikan**:
  - Buat custom hook `useDebounce(value, delay = 350)` untuk menunda trigger filter API hingga user berhenti mengetik selama minimal 350ms.

### 3.3. Ketiadaan React Error Boundary (Sedang)
- **Akar Masalah**: Aplikasi tidak memiliki wrapper `<ErrorBoundary>`.
- **Dampak**: Jika terjadi error runtime (misalnya data acara rusak, parsing tanggal gagal, atau error rendering QR code), React akan meng-unmount seluruh tree dan menampilkan layar putih (*blank page*).
- **Rekomendasi Perbaikan**:
  - Buat komponen `GlobalErrorBoundary.jsx` dengan antarmuka fallback modern (tombol muat ulang, pesan error ramah pengguna, dan opsi kembali ke beranda).

### 3.4. Dead Code & Kebersihan Linter (Rendah)
- **File Tak Terpakai**: `frontend/src/App.css` (185 baris kode sisa default template Vite). File ini tidak diimpor di mana pun dan dapat dihapus dengan aman.
- **Peringatan Linter (28 Warnings)**: Terdapat variabel dan ikon yang diimpor tetapi tidak digunakan di `Navbar.jsx`, `EditEventModal.jsx`, dan `CreateEventModal.jsx`, serta peringatan `set-state-in-effect` di `useBooking.js`.

---

## 4. Analisis Mendalam Sisi Backend & API

### 4.1. Hidden N+1 Query pada Model Accessor (Kritis)
- **Lokasi Kode**: `backend/app/Models/TicketType.php`:
  ```php
  protected $appends = ['sold_count', 'remaining_capacity'];

  public function getSoldCountAttribute(): int
  {
      return $this->tickets()->where('status', '!=', 'cancelled')->count();
  }
  ```
- **Akar Masalah**: Setiap kali model `TicketType` diserialisasi ke JSON, Laravel menjalankan 1 query SQL terpisah untuk setiap kategori tiket.
- **Dampak Performa**: Jika terdapat 20 acara dengan masing-masing 3 tipe tiket:
  - 1 query untuk mengambil daftar acara.
  - 1 query untuk eager load venues.
  - 1 query untuk eager load ticket types.
  - **60 query terpisah** untuk menghitung `sold_count` tiap tiket!
- **Rekomendasi Perbaikan**:
  1. Hapus penghitungan langsung di accessor atau gunakan subquery/eager load count di controller:
     ```php
     $query = Event::with([
         'venue',
         'ticketTypes' => function ($q) {
             $q->withCount(['tickets as sold_count' => function ($sq) {
                 $sq->where('status', '!=', 'cancelled');
             }]);
         },
         'organizer'
     ]);
     ```
  2. Modifikasi accessor di `TicketType` agar memprioritaskan nilai eager loaded jika tersedia:
     ```php
     public function getSoldCountAttribute(): int
     {
         if (array_key_exists('sold_count', $this->attributes)) {
             return (int) $this->attributes['sold_count'];
         }
         return $this->tickets()->where('status', '!=', 'cancelled')->count();
     }
     ```

### 4.2. Concurrency & Race Condition pada Check-In Tiket (Tinggi)
- **Lokasi Kode**: `backend/app/Services/CheckInService.php`:
  ```php
  $ticket = Ticket::with(['registration.event', 'ticketType'])
      ->where('ticket_code', trim($ticketCode))
      ->first();

  if ($ticket->status === 'checked-in') {
      return [...];
  }
  // ...
  $ticket->update(['status' => 'checked-in', 'checked_in_at' => now()]);
  ```
- **Akar Masalah**: Pemeriksaan status dan pembaruan dilakukan tanpa transaksi database dan tanpa kunci baris (*row lock*).
- **Dampak**: Jika tiket yang sama di-scan di dua pintu masuk (*gate*) berbeda secara bersamaan dalam milidetik yang sama, kedua request dapat lolos validasi status `'active'` dan keduanya tercatat sukses (*double check-in exploit*).
- **Rekomendasi Perbaikan**:
  Gunakan transaksi database dengan `lockForUpdate()` atau lakukan *atomic conditional update*:
  ```php
  return DB::transaction(function () use ($ticketCode) {
      $ticket = Ticket::where('ticket_code', trim($ticketCode))
          ->lockForUpdate()
          ->first();

      if (!$ticket) {
          return ['status' => 'error', 'statusCode' => 404, 'message' => 'Tiket tidak ditemukan.'];
      }
      if ($ticket->status === 'checked-in') {
          return ['status' => 'warning', 'statusCode' => 422, 'message' => 'Tiket sudah pernah digunakan.'];
      }
      $ticket->update(['status' => 'checked-in', 'checked_in_at' => now()]);
      return ['status' => 'success', 'statusCode' => 200, 'message' => 'Check-in berhasil!'];
  });
  ```

### 4.3. Paginasi pada Endpoint Acara (Sedang)
- **Lokasi Kode**: `backend/app/Http/Controllers/Api/EventController.php`:
  ```php
  $events = $query->orderBy('start_time', 'asc')->get();
  ```
- **Akar Masalah**: Seluruh data acara diambil sekaligus dengan `->get()`.
- **Rekomendasi Perbaikan**:
  Gunakan `->paginate($request->input('per_page', 12))` untuk membatasi ukuran transfer data dan waktu pemrosesan memori saat jumlah acara mencapai puluhan atau ratusan.

### 4.4. Validasi Batas Maksimal Pemesanan Tiket (Sedang)
- **Lokasi Kode**: `backend/app/Http/Requests/BookTicketRequest.php`:
  ```php
  'items' => 'required|array|min:1',
  ```
- **Akar Masalah**: Array `items` tidak memiliki batasan maksimal (`max:N`).
- **Dampak**: Penyerang atau bot dapat mengirim request dengan 10.000 item dalam satu panggilan API, yang dapat membebani memori server saat iterasi insert tiket.
- **Rekomendasi**: Batasi pemesanan maksimal misalnya `max:10` atau `max:20` tiket per transaksi.

---

## 5. Analisis Database & Indexing (PostgreSQL)

Pada PostgreSQL, pembuatan relasi kunci asing (*Foreign Key*) **tidak otomatis membuat index B-Tree** pada tabel anak. Ini berbeda dengan MySQL (InnoDB) yang otomatis membuatnya.

### 5.1. Ketiadaan Index pada Foreign Keys
Tabel-tabel berikut memerlukan index eksplisit untuk mencegah *sequential scan* saat query JOIN:
1. `registrations.user_id` & `registrations.event_id` (digunakan pada query riwayat tiket user).
2. `tickets.registration_id` & `tickets.ticket_type_id` (digunakan pada relasi tiket dan agregasi kuota).
3. `events.venue_id` & `events.organizer_id` (digunakan saat eager loading detail acara).

### 5.2. Ketiadaan Index untuk Filtering & Sorting
1. `events.start_time`: Digunakan pada sorting default `orderBy('start_time', 'asc')`.
2. `tickets (ticket_type_id, status)`: Sering digunakan dalam klausa `where ticket_type_id = ? AND status != 'cancelled'` untuk pengecekan sisa kapasitas. Indeks komposit akan mempercepat pengecekan kapasitas hingga 10x lipat saat volume tiket mencapai ribuan.

---

## 6. Analisis Keamanan & Otorisasi

| Celah / Area | Tingkat Risiko | Deskripsi | Rekomendasi Solusi |
| :--- | :---: | :--- | :--- |
| **Otorisasi Event Update / Delete** | **Tinggi** | Route `PUT /api/events/{id}` dan `DELETE /api/events/{id}` hanya dilindungi `auth:sanctum`. Pengguna biasa dengan token valid dapat memodifikasi/menghapus acara orang lain jika mengetahui ID-nya. | Buat `EventPolicy` dan panggil `Gate::authorize('update', $event)` untuk memastikan hanya Admin atau Organizer pemilik acara yang diizinkan. |
| **Rate Limiting Login** | **Tinggi** | Route `POST /api/auth/login` tidak memiliki pembatasan laju (*rate limiter*). | Terapkan middleware `throttle:login` atau `throttle:6,1` (maks 6 percobaan per menit) untuk menangkal serangan brute-force. |
| **Token Bloat** | **Rendah** | Saat login berulang kali, token baru dibuat tanpa menghapus token lama yang tidak aktif. | Lakukan pembersihan token lama pada saat login berhasil atau buat mekanisme revoke session sebelumnya. |

---

## 7. Kualitas Kode, Pengujian & Developer Experience

1. **Automated Testing Masih 0%**:
   - Backend saat ini tidak memiliki test suite otomatis (hanya template `ExampleTest.php`).
   - Perlu dibuat Feature Test untuk:
     - `BookingTest.php` (Pengujian kuota tiket habis, kalkulasi harga, transaksi berhasil).
     - `CheckInTest.php` (Pengujian check-in sukses, penolakan tiket ganda, penolakan tiket batal).
     - `EventManagementTest.php` (Pengujian hak akses create/update/delete event).
2. **Pengalaman Pengguna (UX Dialog Konfirmasi)**:
   - Tombol hapus acara pada halaman admin masih mengandalkan popup bawaan browser `window.confirm()`.
   - Sebaiknya diganti dengan modal dialog konfirmasi yang selaras dengan bahasa desain *Acara Tech*.
3. **Standarisasi Format Kode (PHP Pint)**:
   - Pemeriksaan Laravel Pint mendeteksi inkonsistensi formatting pada 9 file PHP. Menjalankan `./vendor/bin/pint` akan merapikan standar PSR-12 secara otomatis.

---

## 8. Matriks Prioritas & Dampak (Impact vs Effort)

```
       TINGGI │  [N+1 Query Fix]          [Code-Splitting]
              │  [CheckIn Atomic Lock]     [Index PostgreSQL]
              │  [Event Authorization]     [useDebounce Hook]
       DAMPAK │──────────────────────────────────────────────
              │  [Hapus Dead Code]         [Automated Feature Tests]
              │  [Pint Auto-Format]        [Custom Confirm Modal]
       RENDAH │  [Limit max tiket]         [Pagination API]
              └──────────────────────────────────────────────
                        RENDAH                      TINGGI
                                  EFFORT
```

---

## 9. Peta Jalan Optimalisasi Bertahap (Actionable Roadmap)

### 📌 Fase 1: Frontend Performance & Resilience (Estimasi: Prioritas 1)
- [ ] Implementasi **Dynamic Route Code-Splitting** dengan `React.lazy()` dan `Suspense`.
- [ ] Optimasi **Vite Manual Chunks** pada `vite.config.js` untuk memecah library pihak ketiga.
- [ ] Buat custom hook **`useDebounce`** pada search bar untuk mencegah *API request spamming*.
- [ ] Tambahkan **`GlobalErrorBoundary`** untuk mencegah layar putih saat terjadi runtime error.
- [ ] Bersihkan file tak terpakai (`App.css`) dan perbaiki 28 peringatan linter `oxlint`.

### 📌 Fase 2: Backend Query & Database Performance (Estimasi: Prioritas 2)
- [ ] Eliminasi **N+1 Query** pada `TicketType` dengan subquery `withCount` tiket aktif.
- [ ] Amankan **`CheckInService`** dengan `DB::transaction()` dan `lockForUpdate()` untuk mencegah *double check-in*.
- [ ] Buat file migrasi penambahan **B-Tree & Composite Index** pada PostgreSQL (`registrations`, `tickets`, `events`).
- [ ] Implementasi **Paginasi** pada `EventController::index()`.

### 📌 Fase 3: Security & Authorization Hardening (Estimasi: Prioritas 3)
- [ ] Buat **`EventPolicy`** untuk memvalidasi hak akses Admin dan Organizer pada aksi update & delete.
- [ ] Tambahkan **Rate Limiter** (`throttle:login`) pada endpoint `/api/auth/login`.
- [ ] Batasi input kuantitas array `items` pada `BookTicketRequest` (`max:10`).
- [ ] Terapkan manajemen pembersihan token lama saat login.

### 📌 Fase 4: Testing & UX Polish (Estimasi: Prioritas 4)
- [ ] Buat skenario pengujian otomatis (*Feature Tests*) untuk alur Booking, Check-in, dan Auth.
- [ ] Ganti `window.confirm()` dengan **Custom Confirm Dialog** modern pada Admin Dashboard.
- [ ] Jalankan Laravel Pint untuk standarisasi format kode PHP.

---

## 10. Target Metrik & Kriteria Keberhasilan (KPI)

| Parameter | Kondisi Saat Ini | Target Pasca Optimalisasi |
| :--- | :---: | :---: |
| **Ukuran JS Bundle Awal (Vite)** | 671.13 kB (Warning) | **< 160 kB** (Optimal) |
| **Jumlah Query SQL pada `GET /api/events` (20 Event)** | ~63 Query (N+1) | **3 - 4 Query** |
| **HTTP Request saat Mengetik di Search Bar** | 1 request per huruf | **1 request per jeda 350ms** |
| **Resistensi Concurrency Check-in** | Rentan Race Condition | **100% Atomik & Aman** |
| **Keamanan Endpoint Modifikasi Acara** | Terbuka bagi semua user login | **Hanya Admin / Pemilik Acara** |
| **Peringatan Linter (Frontend)** | 28 Warnings | **0 Warnings** |
| **Automated Test Coverage (Core Services)** | 0% | **> 85% untuk Booking & Check-in** |

---

*Dokumen ini siap dijadikan acuan kerja untuk inisiasi implementasi bertahap.*
