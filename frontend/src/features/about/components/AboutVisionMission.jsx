import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Target, CheckCircle2 } from 'lucide-react'

export function AboutVisionMission() {
  const missions = [
    {
      title: 'Menghilangkan Antrean Registrasi Manual',
      desc: 'Menggantikan absensi kertas yang lambat dengan validasi pemindai QR Code instan berkecepatan sub-detik di setiap gerbang masuk acara.',
    },
    {
      title: 'Transparansi Kuota & Tier Tiket',
      desc: 'Menyajikan kuota kursi riil tanpa manipulasi, mulai dari Early Bird hingga VIP, sehingga peserta mendapatkan kepastian tiket secara adil.',
    },
    {
      title: 'Pusat Informasi Acara Terpadu',
      desc: 'Menyediakan rundown interaktif, detail lokasi venue, dan tiket digital dalam satu portal yang mudah diakses dari perangkat apa saja.',
    },
    {
      title: 'Perlindungan Privasi & Keamanan Data',
      desc: 'Menjaga keamanan data pendaftar dan kode tiket dengan enkripsi berlapis serta arsitektur backend modern yang reliabel.',
    },
  ]

  return (
    <section className="py-14 sm:py-18 border-b border-slate-200/80 dark:border-[#1e2536]">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Arah & Komitmen Kami
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Prinsip fundamental yang memandu pengembangan platform Acara Tech demi komunitas teknologi Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Vision Card (Left - 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-[#FF5C00] to-orange-600 text-white flex flex-col justify-between shadow-xl shadow-orange-500/15"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight">
                Visi Kami
              </h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Menjadi platform pendaftaran dan manajemen acara teknologi terdepan di Indonesia yang menghubungkan komunitas developer, creator, dan pemimpin industri melalui pengalaman digital kelas dunia.
              </p>
            </div>

            <div className="pt-6 border-t border-white/20 text-xs text-white/80 font-mono">
              #ConnectInnovators #TechEventsID
            </div>
          </motion.div>

          {/* Mission Card (Right - 7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 p-8 rounded-3xl bg-white dark:bg-[#11141e] border border-slate-200 dark:border-[#1e2536] shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5C00] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Misi Utama
                </h3>
              </div>

              <div className="space-y-4">
                {missions.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
