import { Metadata } from 'next';
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from 'next/link';
import { ScrollText, ShieldAlert, Gavel, Scale, AlertTriangle, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | PeyGo',
  description: 'Syarat dan Ketentuan penggunaan layanan PeyGo. Harap baca dengan seksama sebelum menggunakan platform kami.',
};

export default function TermsPage() {
  const lastUpdated = "30 Desember 2025";

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-24 pb-24">
        {/* Header Section */}
        <section className="bg-primary/5 py-16 border-b border-border">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-full text-xs font-medium text-muted-foreground mb-6 shadow-sm">
              <ScrollText className="w-4 h-4 text-primary" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">Syarat & Ketentuan</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Perjanjian penggunaan layanan antara Pengguna dan PeyGo.
            </p>
            <p className="text-sm text-muted-foreground mt-8">
              Terakhir diperbarui: <span className="font-semibold text-foreground">{lastUpdated}</span>
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-12 flex gap-4 text-sm text-amber-800 dark:text-amber-200">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  Dengan mendaftar, mengakses, atau menggunakan layanan PeyGo, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
                </p>
              </div>

              <div className="space-y-12">
                {/* 1. Definisi */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">1. Definisi Akun & Penggunaan</h2>
                  <p className="text-muted-foreground mb-4">
                    Anda harus berusia minimal 18 tahun atau telah memiliki KTP yang sah untuk menggunakan layanan ini.
                  </p>
                  <ul className="space-y-4 list-none pl-0">
                    <li className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <strong className="block text-foreground text-sm mb-1">Keamanan Akun</strong>
                        <span className="text-muted-foreground text-sm">Anda bertanggung jawab penuh untuk menjaga kerahasiaan kredensial akun Anda (email, password, dan PIN/OTP). Segala aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya.</span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <strong className="block text-foreground text-sm mb-1">Verifikasi (KYC)</strong>
                        <span className="text-muted-foreground text-sm">Untuk fitur tertentu (pencairan dana, limit tinggi), kami mewajibkan proses verifikasi identitas sesuai regulasi Bank Indonesia dan OJK.</span>
                      </div>
                    </li>
                  </ul>
                </section>

                {/* 2. Layanan Pembayaran */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">2. Layanan Pembayaran & Invoice</h2>
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="p-5 border border-border rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold mb-2">Gateway Pembayaran</h4>
                      <p className="text-sm text-muted-foreground">PeyGo bertindak sebagai perantara pembayaran. Dana yang diterima dari pelanggan Anda akan ditampung di Escrow Account sebelum diteruskan ke rekening Anda (settlement) sesuai jadwal yang berlaku (T+1 untuk QRIS/VA).</p>
                    </div>
                    <div className="p-5 border border-border rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                        <Scale className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold mb-2">Biaya Layanan</h4>
                      <p className="text-sm text-muted-foreground">Setiap transaksi dikenakan biaya layanan (MDR/Admin Fee) yang transparan. PeyGo berhak mengubah skema biaya dengan pemberitahuan tertulis 7 hari sebelumnya.</p>
                    </div>
                  </div>
                </section>

                {/* 3. Larangan */}
                <section className="bg-destructive/5 border border-destructive/20 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-destructive" />
                    3. Aktivitas Terlarang
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Anda dilarang keras menggunakan PeyGo untuk transaksi yang berkaitan dengan:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground font-medium">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-destructive rounded-full" /> Perjudian & Taruhan</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-destructive rounded-full" /> Obat-obatan Terlarang / Narkotika</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-destructive rounded-full" /> Senjata Api & Bahan Peledak</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-destructive rounded-full" /> Pornografi & Konten Dewasa</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-destructive rounded-full" /> Ponzi Scheme / Investasi Bodong</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-destructive rounded-full" /> Pencucian Uang (Money Laundering)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-6">
                    Pelanggaran terhadap poin ini akan mengakibatkan pembekuan akun permanen dan pelaporan kepada pihak berwajib.
                  </p>
                </section>

                {/* 4. Penutup */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">4. Hukum yang Berlaku</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Syarat & Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Segala sengketa yang timbul akan diselesaikan terlebih dahulu melalui musyawarah mufakat. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui Badan Arbitrase Nasional Indonesia (BANI) atau Pengadilan Negeri Jakarta Selatan.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
