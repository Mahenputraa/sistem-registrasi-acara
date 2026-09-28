# ⚙️ Acara Tech — Backend RESTful API (Laravel 12)

API Server untuk platform registrasi acara dan manajemen e-tiket **Acara Tech**. Dibangun dengan **Laravel 12**, **PostgreSQL 16**, dan **Laravel Sanctum**.

> 💡 **Dokumentasi Lengkap Proyek**: Silakan baca berkas utama [**README.md di direktori akar**](../README.md) untuk arsitektur menyeluruh, diagram alur bisnis, dan integrasi dengan frontend.

---

## 🛠️ Ringkasan Teknologi Backend

- **Framework**: Laravel 12 (PHP 8.4)
- **Database**: PostgreSQL 16
- **Autentikasi**: Laravel Sanctum (Bearer Token)
- **Keamanan Konkurensi**: _Pessimistic Locking_ (`lockForUpdate()`) di dalam database transaction untuk booking tiket dan scanner check-in
- **Otorisasi**: Laravel Policies (`EventPolicy`) untuk RBAC (_Admin_, _Organizer_, _User_)
- **Format & Validasi**: Form Requests, API Resources, dan Laravel Pint (PSR-12)
- **Pengujian**: PHPUnit Feature & Unit Test Suite

---

## 🚀 Menjalankan Server API Lokal

### 1. Konfigurasi Lingkungan (`.env`)

```bash
cp .env.example .env
```

Pastikan pengaturan PostgreSQL sesuai:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sistem_registrasi_acara
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_SSLMODE=disable
```

### 2. Pasang Dependensi & Generate Key

```bash
composer install
php artisan key:generate
```

### 3. Tautkan Direktori Media Storage (Avatar Pengguna)

```bash
php artisan storage:link
```

### 4. Migrasi & Data Seeder

```bash
php artisan migrate:fresh --seed
```

### 5. Jalankan Server API

```bash
php artisan serve --port=8000
```

API akan dapat diakses pada `http://127.0.0.1:8000`.

---

## 🧪 Pengujian & Kualitas Kode

Jalankan test suite otomatis:

```bash
php artisan test
```

Jalankan formatter kode Laravel Pint:

```bash
php vendor/bin/pint --test
```
