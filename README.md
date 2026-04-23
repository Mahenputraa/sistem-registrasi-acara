Sistem Registrasi Acara & Workshop
Sistem Registrasi Acara adalah platform berbasis web yang dirancang untuk memudahkan manajemen pendaftaran acara atau workshop secara efisien. Proyek ini dibangun menggunakan PHP dengan pemisahan struktur folder yang bersih untuk memudahkan pengembangan lebih lanjut.

🚀 Fitur Utama
Manajemen Acara: Membuat dan menampilkan daftar acara yang tersedia.

Formulir Registrasi: Pendaftaran peserta secara online.

Arsitektur Terstruktur: Menggunakan routing dan templating yang terpisah.

Basis Data Terintegrasi: Dilengkapi dengan skema database SQL yang siap pakai.

🛠️ Teknologi yang Digunakan
Bahasa Pemrograman: PHP 8.x

Database: MySQL/MariaDB

Dependency Manager: Composer

Frontend: (Sebutkan jika menggunakan Tailwind/Bootstrap, berdasarkan folder templates)

📋 Prasyarat
Sebelum menjalankan proyek ini, pastikan kamu telah menginstal:

PHP >= 8.0

MySQL Server

Composer

⚙️ Instalasi & Konfigurasi
Clone Repositori

Bash
git clone https://github.com/Ndraa-44/sistem-registrasi-acara.git
cd sistem-registrasi-acara
Instal Dependensi

Bash
composer install
Konfigurasi Database

Buat database baru di MySQL (misal: event_platform).

Impor file event_platform.sql ke database tersebut.

Sesuaikan konfigurasi koneksi database di dalam folder app/ (biasanya file config atau .env).

Jalankan Server Lokal
Jika menggunakan PHP built-in server:

Bash
php -S localhost:8000 -t public
Akses melalui browser di http://localhost:8000.

🧠 Tinjauan Kritis (Mitra Diskusi)
Sesuai dengan peran saya sebagai mitra diskusi intelektual, saya mencatat beberapa poin penting terkait struktur repositori saat ini:

Pemeriksaan Logika (Vendor Folder): Saya melihat folder vendor/ masuk ke dalam pelacakan Git. Secara praktik standar (Best Practice), folder vendor/ seharusnya dimasukkan ke dalam .gitignore karena dependensi harus diinstal melalui composer install oleh masing-masing pengembang. Menyimpan vendor/ di Git akan membuat ukuran repositori membengkak secara tidak perlu.

Tinjauan Asumsi (Keamanan): Proyek ini menyediakan file .sql mentah. Pastikan dalam kode PHP-mu, kamu tidak mengasumsikan database selalu memiliki kredensial root tanpa password. Saya sarankan menambahkan contoh file .env.example agar pengguna tahu variabel lingkungan apa saja yang perlu diatur tanpa mengekspos rahasia asli.

Sudut Pandang Alternatif (Deployment): Jika sistem ini akan dikembangkan menjadi proyek skala besar atau didaftarkan untuk tugas kuliah semester 5, pertimbangkan untuk menambahkan validasi input di sisi server dan sanitasi database (PDO/Prepared Statements) untuk menghindari SQL Injection, mengingat ini adalah "Sistem Registrasi" yang rawan serangan input.

Koreksi Alur: Di dalam folder public/, pastikan file index.php berfungsi sebagai Single Entry Point. Jika tidak, dokumentasi di atas mungkin perlu disesuaikan tergantung bagaimana kamu menangani routing di folder routes/.
