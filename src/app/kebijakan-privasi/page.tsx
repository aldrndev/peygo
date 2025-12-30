import { Metadata } from 'next';
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, Server, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | PeyGo',
  description: 'Kebijakan Privasi PeyGo menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda sesuai standar keamanan enterprise.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "30 Desember 2025";

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-24 pb-24">
        {/* Header Section */}
        <section className="bg-primary/5 py-16 border-b border-border">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-full text-xs font-medium text-muted-foreground mb-6 shadow-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span>Enterprise Grade Security</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">Kebijakan Privasi</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Komitmen kami untuk melindungi privasi dan keamanan data Anda dengan standar industri tertinggi.
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
              <div className="bg-card border border-border rounded-xl p-8 mb-12 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  Ringkasan Eksekutif
                </h3>
                <p className="text-muted-foreground mb-0">
                  PeyGo ("Kami") menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengelola data pribadi Anda saat menggunakan layanan kami. Kami mematuhi peraturan perundang-undangan yang berlaku di Republik Indonesia, termasuk namun tidak terbatas pada UU Perlindungan Data Pribadi (UU PDP).
                </p>
              </div>

              <div className="space-y-12">
                {/* 1. Pengumpulan Data */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">1</span>
                    Pengumpulan Data
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Kami mengumpulkan informasi yang Anda berikan secara langsung, informasi yang kami kumpulkan secara otomatis, dan informasi dari sumber pihak ketiga.
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-6 list-none pl-0">
                    <li className="bg-muted/30 p-5 rounded-lg border border-border">
                      <strong className="block text-foreground mb-2">Data Identitas</strong>
                      <span className="text-sm text-muted-foreground">Nama lengkap, alamat email, nomor telepon, dan data KTP/NPWP untuk verifikasi KYC (Know Your Customer).</span>
                    </li>
                    <li className="bg-muted/30 p-5 rounded-lg border border-border">
                      <strong className="block text-foreground mb-2">Data Transaksi</strong>
                      <span className="text-sm text-muted-foreground">Detail invoice, riwayat pembayaran, informasi rekening bank, dan data e-wallet yang digunakan.</span>
                    </li>
                    <li className="bg-muted/30 p-5 rounded-lg border border-border">
                      <strong className="block text-foreground mb-2">Data Teknis</strong>
                      <span className="text-sm text-muted-foreground">Alamat IP, tipe browser, sistem operasi, dan data log aktivitas untuk keamanan sistem.</span>
                    </li>
                    <li className="bg-muted/30 p-5 rounded-lg border border-border">
                      <strong className="block text-foreground mb-2">Data Penggunaan</strong>
                      <span className="text-sm text-muted-foreground">Interaksi Anda dengan fitur layanan kami untuk tujuan analisis dan peningkatan produk.</span>
                    </li>
                  </ul>
                </section>

                {/* 2. Penggunaan Data */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">2</span>
                    Penggunaan Data
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Data yang kami kumpulkan digunakan untuk tujuan-tujuan berikut:
                  </p>
                  <ul className="space-y-3 text-muted-foreground list-disc pl-6">
                    <li>Menyediakan, mengoperasikan, dan memelihara layanan PeyGo.</li>
                    <li>Memproses transaksi pembayaran dan rekonsiliasi invoice.</li>
                    <li>Melakukan verifikasi identitas (KYC) sesuai regulasi anti pencucian uang.</li>
                    <li>Mendeteksi dan mencegah penipuan, penyalahgunaan, atau aktivitas ilegal.</li>
                    <li>Mengirimkan notifikasi transaksi, pembaruan keamanan, dan dukungan layanan.</li>
                    <li>Meningkatkan kualitas layanan melalui analisis data agregat.</li>
                  </ul>
                </section>

                {/* 3. Berbagi Data */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">3</span>
                    Penyimpanan & Keamanan
                  </h2>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang ketat untuk melindungi data Anda. Data sensitif dienkripsi baik saat transit (SSL/TLS) maupun saat disimpan (AES-256).
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                        <Server className="w-5 h-5 shrink-0" />
                        <p>Pusat data kami berlokasi di Indonesia, mematuhi persyaratan lokalisasi data PP No. 71 Tahun 2019.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Hak Pengguna */}
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">4</span>
                    Hak Anda
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Sebagai subjek data, Anda memiliki hak-hak berikut:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {['Hak Akses Data', 'Hak Koreksi Data', 'Hak Penghapusan', 'Hak Portabilitas', 'Hak Pembatasan Proses', 'Hak Menolak Proses'].map((hak, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card text-sm font-medium">
                        <CheckIcon />
                        {hak}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Contact */}
                <section className="bg-muted p-8 rounded-2xl text-center">
                  <h3 className="text-lg font-bold mb-3">Pusat Bantuan Privasi</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Jika Anda memiliki pertanyaan tentang kebijakan ini atau ingin menggunakan hak privasi Anda, silakan hubungi <span className="font-semibold text-foreground">Data Protection Officer (DPO)</span> kami.
                  </p>
                  <Link href="mailto:dpo@peygo.id" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Hubungi DPO
                  </Link>
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

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
