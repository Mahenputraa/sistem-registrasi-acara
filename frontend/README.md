# 🎨 Acara Tech — Frontend Client (React 19 + Vite 8)

Aplikasi klien Single Page Application (SPA) untuk platform registrasi acara dan manajemen e-tiket **Acara Tech**. Dibangun dengan **React 19**, **Vite 8**, **Tailwind CSS v4**, **Framer Motion**, dan **Zustand**.

> 💡 **Dokumentasi Lengkap Proyek**: Silakan baca berkas utama [**README.md di direktori akar**](../README.md) untuk panduan menyeluruh tentang arsitektur sistem, database, dan API backend.

---

## 🛠️ Ringkasan Teknologi Frontend

- **Framework & Bundler**: React 19 + Vite 8 (Rolldown / Rolldown runtime)
- **Styling**: Tailwind CSS v4 + Glassmorphism UI
- **Desain & Tema**: Dual Theme (_Dark & Light Mode_) dengan Google Fonts (_Plus Jakarta Sans_ & _Space Grotesk_)
- **Animasi & Interaksi**: Framer Motion (transisi halaman & modal) + Canvas Confetti
- **State Management**: Zustand (`useModalStore`, `useAuthStore`) + React Context (`AuthContext`, `ThemeContext`)
- **Notifikasi**: Sonner Toasts
- **QR Generator**: `qrcode.react` (SVG QR Code untuk tiket boarding pass)
- **Kinerja**: _Dynamic Route Code-Splitting_ (`React.lazy` + `Suspense`) & _Vendor Chunking_ (< 115 kB main chunk)
- **Linter**: Oxlint

---

## 🚀 Menjalankan Server Pengembangan

### 1. Pasang Dependensi

```bash
npm install
```

### 2. Jalankan Mode Development

```bash
npm run dev
```

Aplikasi akan aktif di `http://localhost:5173`.

Vite telah dikonfigurasi dengan reverse proxy otomatis:

- `/api` ➡️ `http://127.0.0.1:8000`
- `/storage` ➡️ `http://127.0.0.1:8000` (untuk memuat gambar avatar pengguna yang diunggah)

---

## 📦 Skrip yang Tersedia

- `npm run dev`: Menjalankan development server dengan Hot Module Replacement (HMR).
- `npm run build`: Membangun bundle produksi teroptimasi ke direktori `dist/`.
- `npm run lint`: Menjalankan pemeriksaan linter cepat dengan Oxlint.
- `npm run preview`: Menjalankan server preview lokal untuk hasil build `dist/`.
