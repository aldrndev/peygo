import { Metadata } from 'next';
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ScrollText, AlertTriangle, CreditCard, Scale, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | PeyGo',
  description: 'Syarat dan Ketentuan penggunaan layanan PeyGo. Harap baca dengan seksama sebelum menggunakan platform kami.',
};

export default function TermsPage() {
  const lastUpdated = "30 Desember 2025";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingHeader />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Header */}
          <header className="mb-16 border-b border-border pb-8">
            <div className="flex items-center gap-2 text-primary font-medium text-sm mb-4">
              <ScrollText className="w-4 h-4" />
              <span>Legal & Ketentuan</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Syarat & Ketentuan</h1>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Perjanjian penggunaan layanan antara Anda (Pengguna) dan PeyGo. Harap baca dokumen ini dengan seksama.
            </p>
            <div className="mt-6 text-sm text-foreground/80">
              Terakhir diperbarui: <span className="font-medium text-foreground">{lastUpdated}</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary">
            
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-5 mb-12 flex gap-4 text-sm text-foreground not-prose">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
              <p>
                Dengan mendaftar, mengakses, atau menggunakan layanan PeyGo, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini.
              </p>
            </div>

            <section className="mb-12">
              <h2>1. Definisi Akun & Penggunaan</h2>
              <p className="text-foreground/80">
                Layanan ini hanya untuk pengguna berusia minimal 18 tahun atau yang memiliki legalitas hukum yang sah.
              </p>
              <ul className="space-y-4 list-none pl-0 not-prose mt-6">
                <li className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <strong className="block text-foreground text-sm font-semibold mb-1">Keamanan Akun</strong>
                    <span className="text-foreground/80 text-sm">Jaga kerahasiaan email, password, dan PIN/OTP Anda. Anda bertanggung jawab penuh atas segala aktivitas di akun Anda.</span>
                  </div>
                </li>
                <li className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <strong className="block text-foreground text-sm font-semibold mb-1">Verifikasi (KYC)</strong>
                    <span className="text-foreground/80 text-sm">Wajib melakukan verifikasi identitas (e-KTP/NPWP) untuk fitur pencairan dana dan limit transaksi tertentu.</span>
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>2. Layanan Pembayaran & Invoice</h2>
              <div className="grid sm:grid-cols-2 gap-4 not-prose mt-6">
                <div className="p-5 border border-border rounded-lg bg-card text-card-foreground">
                  <div className="flex items-center gap-3 mb-3 text-primary">
                    <CreditCard className="w-5 h-5" />
                    <h4 className="font-semibold text-foreground">Gateway Pembayaran</h4>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">Dana pelanggan ditampung di Escrow Account sebelum diteruskan ke rekening Anda (settlement).</p>
                </div>
                <div className="p-5 border border-border rounded-lg bg-card text-card-foreground">
                  <div className="flex items-center gap-3 mb-3 text-primary">
                    <Scale className="w-5 h-5" />
                    <h4 className="font-semibold text-foreground">Biaya Layanan</h4>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">Setiap transaksi dikenakan biaya layanan (MDR/Admin Fee) yang transparan sesuai ketentuan berlaku.</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2>3. Aktivitas Terlarang</h2>
              <p className="text-foreground/80">
                Kami menerapkan kebijakan <strong>Zero Tolerance</strong> terhadap penggunaan layanan untuk aktivitas ilegal, termasuk namun tidak terbatas pada:
              </p>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 mt-4 not-prose">
                <div className="flex items-center gap-2 text-destructive font-semibold mb-4">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Dilarang Keras:</span>
                </div>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-foreground">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-destructive rounded-full" /> Perjudian & Taruhan</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-destructive rounded-full" /> Obat-obatan Terlarang</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-destructive rounded-full" /> Senjata Api & Bahan Peledak</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-destructive rounded-full" /> Pornografi</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-destructive rounded-full" /> Investasi Bodong / Ponzi</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-destructive rounded-full" /> Pencucian Uang (Money Laundering)</li>
                </ul>
              </div>
            </section>

            <section className="mb-12 border-t border-border pt-8">
              <h2>4. Hukum yang Berlaku</h2>
              <p className="text-foreground/80">
                Syarat & Ketentuan ini diatur oleh hukum Republik Indonesia. Sengketa akan diselesaikan melalui musyawarah mufakat, atau melalui BANI / Pengadilan Negeri Jakarta Selatan jika tidak tercapai kesepakatan.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
