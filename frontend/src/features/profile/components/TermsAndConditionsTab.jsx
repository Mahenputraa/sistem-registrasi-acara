import React, { useState } from 'react'
import { FileText, ShieldAlert, Ticket, CheckCircle, HelpCircle, Search, Info } from 'lucide-react'
import { Input } from '../../../components/ui/input'

export function TermsAndConditionsTab() {
  const [searchQuery, setSearchQuery] = useState('')

  const sections = [
    {
      id: 'account',
      icon: CheckCircle,
      title: '1. Pendaftaran Akun & Integritas Data Peserta',
      content: [
        'Setiap pengguna wajib memberikan data identitas yang akurat, termasuk nama lengkap dan alamat email aktif saat mendaftar di sistem.',
        'Nama akun yang tertera akan dicantumkan secara otomatis pada e-tiket acara, daftar absensi check-in, dan e-sertifikat kegiatan (apabila disediakan oleh penyelenggara).',
        'Pengguna bertanggung jawab penuh atas keamanan kata sandi dan seluruh aktivitas yang terjadi melalui akun masing-masing.',
        'Penyalahgunaan akun atau pemalsuan data identitas dapat mengakibatkan penonaktifan akses akun dan pembatalan tiket yang telah dipesan tanpa kompensasi.',
      ],
    },
    {
      id: 'tickets',
      icon: Ticket,
      title: '2. Pemesanan & Kepemilikan E-Tiket',
      content: [
        'Setiap transaksi pemesanan tiket yang berhasil akan menerbitkan kode tiket unik beserta QR Code terenkripsi yang dapat diakses di menu "Tiket Acara Saya".',
        'Satu tiket hanya berlaku untuk 1 (satu) orang peserta dan 1 (satu) kali pemindaian masuk (check-in) di venue acara.',
        'Pengguna dilarang keras menyalin, menggandakan, mendistribusikan secara ilegal, atau memperjualbelikan tiket kembali melebihi ketentuan tarif yang ditetapkan panitia.',
        'Kehilangan atau kelalaian penyebaran gambar QR Code tiket kepada pihak ketiga di luar tanggung jawab pengelola platform registrasi acara.',
      ],
    },
    {
      id: 'checkin',
      icon: ShieldAlert,
      title: '3. Prosedur Masuk & Pemindaian Check-in',
      content: [
        'Peserta wajib menunjukkan e-tiket digital pada perangkat ponsel atau cetakan fisik tiket resmi kepada petugas panitia di gerbang registrasi.',
        'Petugas check-in berhak meminta bukti kartu identitas resmi (KTP/SIM/Kartu Pelajar) apabila ditemukan ketidaksesuaian data pada kode tiket.',
        'Tiket yang telah berstatus "Checked-in" tidak dapat dipindai ulang oleh orang lain untuk memasuki lokasi acara.',
        'Penyelenggara berhak menolak akses masuk bagi pengunjung yang tidak dapat menunjukkan tiket resmi atau terindikasi melakukan pemalsuan barcode.',
      ],
    },
    {
      id: 'cancellation',
      icon: Info,
      title: '4. Perubahan Jadwal, Pembatalan & Pengalihan Tiket',
      content: [
        'Penyelenggara acara berhak melakukan penyesuaian jadwal atau perpindahan lokasi karena pertimbangan keamanan atau keadaan kahar (force majeure).',
        'Pemberitahuan perubahan jadwal atau pembatalan acara akan diinformasikan melalui alamat email terdaftar pengguna dan pengumuman resmi di halaman detail acara.',
        'Kebijakan pengembalian dana (refund) sepenuhnya tunduk pada ketentuan khusus yang diatur oleh masing-masing penyelenggara acara.',
        'Pengalihan kepemilikan tiket kepada peserta lain wajib dikoordinasikan secara langsung kepada panitia penyelenggara sebelum hari pelaksanaan acara.',
      ],
    },
    {
      id: 'privacy',
      icon: FileText,
      title: '5. Privasi & Keamanan Data Pribadi',
      content: [
        'Data pribadi pengguna disimpan secara terenkripsi dan hanya digunakan untuk keperluan verifikasi registrasi, penerbitan tiket, dan komunikasi terkait acara.',
        'Kami tidak pernah memperjualbelikan atau membagikan data identitas pribadi Anda kepada pihak ketiga yang tidak berhubungan dengan penyelenggaraan acara.',
        'Pengguna berhak memperbarui nama, email, dan foto profil sewaktu-waktu melalui halaman Pengaturan Profil ini.',
      ],
    },
  ]

  const filteredSections = sections.filter((sec) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.content.some((item) => item.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] shadow-sm space-y-6">
        {/* Header & Date Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1e2536] gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF5C00]" />
              Syarat & Ketentuan Layanan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Panduan aturan penggunaan platform pendaftaran dan manajemen tiket acara.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161B28] border border-slate-200/80 dark:border-[#293247] text-[11px] text-slate-600 dark:text-slate-300 self-start sm:self-auto font-mono">
            <span>Revisi: 28 Sep 2026</span>
          </div>
        </div>

        {/* Search quick filter */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari klausul (misal: tiket, pembatalan, check-in)..."
            className="pl-10 h-10 text-xs bg-slate-50/50 dark:bg-[#0c0e16]/50"
          />
        </div>

        {/* Content Clauses */}
        <div className="space-y-6 pt-2">
          {filteredSections.length > 0 ? (
            filteredSections.map((sec) => {
              const IconComp = sec.icon
              return (
                <div
                  key={sec.id}
                  className="p-5 rounded-xl bg-slate-50/60 dark:bg-[#161B28]/40 border border-slate-200/70 dark:border-[#293247]/60 space-y-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-sm">
                    <div className="w-7 h-7 rounded-lg bg-[#FF5C00]/10 text-[#FF5C00] flex items-center justify-center shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span>{sec.title}</span>
                  </div>

                  <ul className="space-y-2 pl-9 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc">
                    {sec.content.map((clause, idx) => (
                      <li key={idx}>{clause}</li>
                    ))}
                  </ul>
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-400 mb-1" />
              <p>Tidak ada klausul yang cocok dengan pencarian "{searchQuery}".</p>
            </div>
          )}
        </div>

        {/* Footer Notice */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#1e2536] flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-[#FF5C00] shrink-0" />
          <p>
            Dengan menggunakan platform pendaftaran acara ini, Anda menyetujui seluruh syarat dan ketentuan yang berlaku di atas.
          </p>
        </div>
      </div>
    </div>
  )
}
