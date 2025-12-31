import { Metadata } from 'next';
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from 'next/link';
import { Shield, Lock, Server, Check } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate once per day

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | PeyGo',
  description: 'Kebijakan Privasi PeyGo menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda sesuai standar keamanan enterprise.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "30 Desember 2025";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingHeader />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Header */}
          <header className="mb-16 border-b border-border pb-8">
            <div className="flex items-center gap-2 text-primary font-medium text-sm mb-4">
              <Shield className="w-4 h-4" />
              <span>Privasi & Keamanan Data</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Kebijakan Privasi</h1>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Komitmen kami untuk melindungi data pribadi Anda sesuai dengan standar keamanan enterprise dan regulasi yang berlaku.
            </p>
            <div className="mt-6 text-sm text-foreground/80">
              Terakhir diperbarui: <span className="font-medium text-foreground">{lastUpdated}</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary">
            
            <div className="bg-card border border-border rounded-lg p-6 mb-12 shadow-sm not-prose">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Ringkasan Eksekutif
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                PeyGo menghargai privasi Anda. Kami mengelola data hanya untuk keperluan layanan, verifikasi, dan keamanan. Kami patuh terhadap UU Perlindungan Data Pribadi (UU PDP).
              </p>
            </div>

            <section className="mb-12">
              <h2>1. Pengumpulan Data</h2>
              <p className="text-foreground/80">
                Kami mengumpulkan informasi yang Anda berikan secara langsung, informasi yang kami kumpulkan secara otomatis, dan informasi dari sumber pihak ketiga.
              </p>
              <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0 not-prose mt-6">
                <li className="p-4 rounded-lg border border-border bg-muted/20">
                  <strong className="block text-foreground text-sm font-semibold mb-1">Data Identitas</strong>
                  <span className="text-sm text-foreground/80 leading-snug block">Nama, email, telepon, KTP/NPWP untuk verifikasi.</span>
                </li>
                <li className="p-4 rounded-lg border border-border bg-muted/20">
                  <strong className="block text-foreground text-sm font-semibold mb-1">Data Transaksi</strong>
                  <span className="text-sm text-foreground/80 leading-snug block">Detail invoice, riwayat pembayaran, rekening bank.</span>
                </li>
                <li className="p-4 rounded-lg border border-border bg-muted/20">
                  <strong className="block text-foreground text-sm font-semibold mb-1">Data Teknis</strong>
                  <span className="text-sm text-foreground/80 leading-snug block">IP address, tipe browser, log aktivitas sistem.</span>
                </li>
                <li className="p-4 rounded-lg border border-border bg-muted/20">
                  <strong className="block text-foreground text-sm font-semibold mb-1">Data Penggunaan</strong>
                  <span className="text-sm text-foreground/80 leading-snug block">Interaksi dengan fitur layanan untuk analisis.</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>2. Penggunaan Data</h2>
              <p className="text-foreground/80">Data digunakan untuk:</p>
              <ul className="text-foreground/80">
                <li>Menyediakan dan memelihara layanan PeyGo.</li>
                <li>Memproses pembayaran dan rekonsiliasi.</li>
                <li>Verifikasi identitas (KYC) dan keamanan.</li>
                <li>Mencegah penipuan dan aktivitas ilegal.</li>
                <li>Komunikasi terkait layanan dan dukungan pelanggan.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>3. Penyimpanan & Keamanan</h2>
              <p className="text-foreground/80">
                Keamanan data adalah prioritas utama kami. Kami menggunakan enkripsi standar industri (AES-256 untuk penyimpanan, SSL/TLS untuk transmisi).
              </p>
              <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-md text-sm text-foreground not-prose mt-4">
                <Server className="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <p>Pusat data kami berlokasi di Indonesia, mematuhi PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2>4. Hak Anda</h2>
              <p className="text-foreground/80">Sebagai pengguna, Anda memiliki hak atas data pribadi Anda:</p>
              <div className="grid sm:grid-cols-2 gap-3 not-prose mt-4">
                {['Akses Data', 'Koreksi Data', 'Penghapusan', 'Portabilitas', 'Pembatasan Proses', 'Penolakan Proses'].map((hak, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Hak {hak}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 pt-8 border-t border-border">
              <h3>Hubungi Kami</h3>
              <p className="text-foreground/80">
                Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau ingin menggunakan hak Anda, silakan hubungi Data Protection Officer (DPO) kami.
              </p>
              <div className="mt-6 not-prose">
                <Link href="mailto:dpo@peygo.id" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Hubungi DPO
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
