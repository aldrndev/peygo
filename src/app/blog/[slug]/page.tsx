import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, Share2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";

// Comprehensive blog posts data with full content
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}> = {
  "cara-membuat-invoice-profesional": {
    title: "5 Tips Membuat Invoice Profesional untuk UMKM",
    excerpt: "Pelajari cara membuat invoice yang terlihat profesional dan meningkatkan kredibilitas bisnis Anda di mata pelanggan.",
    image: "/blog/invoice-tips.jpg",
    author: "Tim PeyGo",
    date: "2024-12-20",
    readTime: "8 menit",
    category: "Tips Bisnis",
    content: `
Invoice bukan sekadar dokumen tagihan—ia adalah representasi profesionalisme bisnis Anda. Invoice yang dibuat dengan baik tidak hanya mempercepat pembayaran, tetapi juga membangun kepercayaan pelanggan terhadap brand Anda.

Dalam artikel ini, kami akan membahas 5 tips praktis untuk membuat invoice yang profesional, lengkap dengan contoh dan best practices yang bisa langsung Anda terapkan.

## 1. Gunakan Branding yang Konsisten

Branding adalah identitas bisnis Anda. Ketika pelanggan menerima invoice, mereka harus langsung bisa mengenali dari siapa tagihan tersebut berasal.

**Elemen branding yang wajib ada:**

- **Logo bisnis** — Letakkan di bagian atas invoice dengan ukuran proporsional
- **Warna brand** — Gunakan warna utama bisnis Anda untuk header atau aksen
- **Font yang konsisten** — Pilih font yang sama dengan materi marketing lainnya
- **Tagline** (opsional) — Jika ada, tambahkan di bawah logo

**Tips Pro:** Dengan PeyGo, Anda bisa mengupload logo dan mengatur warna brand sekali, lalu otomatis diterapkan ke semua invoice yang Anda buat.

## 2. Sertakan Informasi Lengkap dan Terstruktur

Invoice yang tidak lengkap sering menyebabkan kebingungan dan penundaan pembayaran. Berikut informasi yang wajib ada:

**Informasi Bisnis Anda:**
- Nama bisnis atau nama Anda (untuk freelancer)
- Alamat lengkap
- Nomor telepon dan email
- NPWP (jika ada)

**Informasi Pelanggan:**
- Nama perusahaan atau individu
- Alamat penagihan
- Contact person (jika B2B)

**Detail Transaksi:**
- Nomor invoice yang unik (contoh: INV-2024-001)
- Tanggal pembuatan invoice
- Tanggal jatuh tempo pembayaran
- Deskripsi produk/jasa dengan detail
- Kuantitas dan harga satuan
- Subtotal, diskon (jika ada), pajak, dan total akhir

**Contoh Format Nomor Invoice:**
- Format sederhana: INV-001, INV-002
- Format dengan tanggal: INV-2024-12-001
- Format dengan kode klien: INV-ABC-2024-001

## 3. Buat Metode Pembayaran yang Mudah dan Beragam

Semakin mudah pelanggan membayar, semakin cepat uang masuk ke rekening Anda. Data menunjukkan bahwa invoice dengan multiple payment options dibayar 30% lebih cepat.

**Metode pembayaran yang sebaiknya Anda tawarkan:**

- **Transfer Bank** — Masih menjadi pilihan utama di Indonesia
- **Virtual Account** — Memudahkan rekonsiliasi karena nomor unik per transaksi
- **QRIS** — Populer untuk transaksi kecil-menengah, bisa dibayar dari e-wallet manapun
- **E-Wallet** — GoPay, OVO, DANA untuk kemudahan generasi muda
- **Kartu Kredit/Debit** — Untuk transaksi besar atau pelanggan korporat

**Tips Pro:** PeyGo menyediakan payment link di setiap invoice yang mendukung semua metode pembayaran di atas. Pelanggan cukup klik link dan pilih cara bayar favorit mereka.

## 4. Tetapkan Payment Terms yang Jelas

Ketidakjelasan terms pembayaran adalah penyebab utama keterlambatan bayar. Pastikan invoice Anda mencantumkan:

**Elemen Payment Terms:**

- **Due date yang spesifik** — Jangan hanya tulis "Net 30", tapi tulis juga tanggal pastinya
- **Konsekuensi keterlambatan** — Apakah ada denda? Berapa persen?
- **Early payment discount** (opsional) — Misalnya diskon 2% jika bayar dalam 10 hari
- **Metode pembayaran yang diterima** — Jelaskan opsi yang tersedia

**Contoh Payment Terms:**
> "Pembayaran jatuh tempo pada 15 Januari 2025. Keterlambatan akan dikenakan denda 1% per bulan. Dapatkan diskon 2% untuk pembayaran sebelum 5 Januari 2025."

## 5. Automasi Pengingat Pembayaran

Menagih secara manual itu melelahkan dan sering terasa awkward. Automasi adalah solusinya.

**Kapan sebaiknya mengirim pengingat:**

- **H-3 sebelum jatuh tempo** — Pengingat ramah bahwa pembayaran akan segera jatuh tempo
- **Hari H** — Notifikasi bahwa hari ini adalah deadline
- **H+3 setelah jatuh tempo** — Pengingat pertama keterlambatan
- **H+7** — Pengingat kedua dengan nada lebih tegas

**Template Pesan Pengingat H-3:**
> "Halo [Nama], ini pengingat bahwa invoice #INV-001 senilai Rp 5.000.000 akan jatuh tempo pada [Tanggal]. Silakan klik link berikut untuk melakukan pembayaran: [Link]. Terima kasih!"

## Bonus: Checklist Invoice Profesional

Sebelum mengirim invoice, pastikan Anda sudah mengecek:

✅ Logo dan branding sudah benar
✅ Semua informasi bisnis lengkap
✅ Detail transaksi akurat
✅ Nomor invoice unik
✅ Tanggal jatuh tempo jelas
✅ Payment terms tercantum
✅ Link pembayaran berfungsi
✅ Tidak ada typo

## Kesimpulan

Invoice profesional bukan hanya tentang tampilan—tetapi tentang membangun kepercayaan, mempercepat pembayaran, dan meningkatkan kredibilitas bisnis Anda.

Dengan menerapkan 5 tips di atas, Anda akan melihat peningkatan dalam kecepatan pembayaran dan kepuasan pelanggan.

**Siap membuat invoice profesional pertama Anda?** Daftar gratis di PeyGo dan buat invoice dalam hitungan detik. Lengkap dengan branding, payment link, dan pengingat otomatis.
    `,
  },
  "manfaat-pembayaran-digital-umkm": {
    title: "7 Alasan Mengapa UMKM Harus Beralih ke Pembayaran Digital",
    excerpt: "Era digital menghadirkan banyak kemudahan. Temukan alasan mengapa pembayaran digital penting untuk pertumbuhan bisnis Anda.",
    image: "/blog/digital-payment.jpg",
    author: "Tim PeyGo",
    date: "2024-12-15",
    readTime: "10 menit",
    category: "Edukasi",
    content: `
Transformasi digital bukan lagi pilihan—ini adalah keharusan. Data Bank Indonesia menunjukkan bahwa transaksi pembayaran digital di Indonesia tumbuh 38.89% di tahun 2023, mencapai Rp 533,75 triliun.

UMKM yang tidak beradaptasi berisiko tertinggal. Dalam artikel ini, kami akan membahas 7 alasan kuat mengapa pembayaran digital adalah investasi terbaik untuk bisnis Anda.

## 1. Efisiensi Waktu yang Signifikan

Waktu adalah aset paling berharga bagi pemilik UMKM. Pembayaran digital menghemat waktu dalam berbagai aspek:

**Sebelum (Manual):**
- Mencatat transaksi satu per satu
- Mencocokkan mutasi bank secara manual
- Mengejar pembayaran via telepon/WA
- Membuat laporan bulanan dari nol

**Sesudah (Digital):**
- Transaksi tercatat otomatis real-time
- Rekonsiliasi otomatis dengan sistem
- Pengingat pembayaran terkirim automatis
- Laporan tersedia dengan sekali klik

**Studi Kasus:** Toko Sembako Bu Ratna di Surabaya menghemat 10 jam per minggu setelah beralih ke pembayaran digital. Waktu tersebut kini digunakan untuk mengembangkan produk baru.

## 2. Jangkauan Pelanggan Lebih Luas

Dengan pembayaran digital, lokasi bukan lagi batasan.

**Keuntungan:**
- Pelanggan dari seluruh Indonesia bisa membayar Anda
- Tidak perlu bertemu fisik untuk transaksi
- Bisa melayani pelanggan 24/7
- Potensi ekspansi ke pasar internasional

**Data Menarik:** 73% konsumen Indonesia lebih memilih berbelanja online dari bisnis yang menyediakan multiple payment options (Sumber: Asosiasi E-Commerce Indonesia, 2023).

## 3. Rekam Jejak Keuangan yang Rapi

Pembukuan manual sering tidak akurat dan sulit dilacak. Pembayaran digital menyelesaikan masalah ini.

**Manfaat untuk Bisnis:**
- Setiap transaksi tercatat dengan timestamp akurat
- Histori pembayaran lengkap tersimpan
- Mudah melacak siapa yang sudah/belum bayar
- Data siap untuk pelaporan pajak
- Audit trail untuk keperluan legal

**Tips:** Pilih platform pembayaran yang menyediakan fitur export data ke Excel atau integrasi dengan software akuntansi.

## 4. Keamanan Transaksi Terjamin

Pembayaran tunai memiliki risiko: uang palsu, kehilangan, pencurian. Pembayaran digital mengeliminasi risiko ini.

**Lapisan Keamanan Pembayaran Digital:**
- Enkripsi SSL 256-bit untuk semua transaksi
- Autentikasi dua faktor (2FA)
- Fraud detection system
- Diawasi oleh Bank Indonesia dan OJK
- Dana tersimpan di rekening escrow (untuk marketplace)

**Fakta:** Tingkat fraud pada transaksi digital yang menggunakan payment gateway berlisensi hanya 0.01%, jauh lebih rendah dibanding transaksi tunai.

## 5. Meningkatkan Kepuasan Pelanggan

Pelanggan modern mengharapkan kemudahan. Bisnis yang menyediakan opsi pembayaran beragam mendapat nilai plus.

**Preferensi Pembayaran Generasi Z dan Milenial:**
- 89% lebih memilih pembayaran non-tunai
- 67% pernah membatalkan transaksi karena tidak ada opsi pembayaran yang diinginkan
- 78% lebih loyal pada bisnis dengan pengalaman pembayaran seamless

**Apa yang Pelanggan Inginkan:**
- Opsi pembayaran beragam (QRIS, e-wallet, VA, kartu kredit)
- Proses checkout yang cepat (kurang dari 1 menit)
- Konfirmasi pembayaran instan
- Bukti transaksi yang bisa disimpan

## 6. Cash Flow Lebih Terprediksi

Salah satu tantangan terbesar UMKM adalah cash flow yang tidak stabil. Pembayaran digital membantu menstabilkan ini.

**Bagaimana Pembayaran Digital Membantu:**
- Settlement dana yang terjadwal dan konsisten
- Visibility terhadap pending payment
- Kemampuan set payment term yang jelas
- Pengingat otomatis mengurangi keterlambatan bayar

**Tips Optimasi Cash Flow:**
1. Set payment term maksimal 14 hari untuk invoice besar
2. Tawarkan early payment discount
3. Gunakan fitur pengingat otomatis
4. Monitor aging report secara rutin

## 7. Data untuk Pengambilan Keputusan

Data adalah "minyak baru" dalam bisnis. Pembayaran digital menghasilkan data berharga.

**Insight yang Bisa Anda Dapatkan:**
- Produk/jasa mana yang paling laris
- Pelanggan mana yang paling valuable
- Tren penjualan per bulan/kuartal
- Metode pembayaran favorit pelanggan
- Rata-rata waktu pembayaran

**Contoh Penggunaan Data:**
> "Dengan melihat data, kami sadar bahwa 60% pelanggan membayar via QRIS. Kami kemudian memutuskan untuk menampilkan QR code lebih prominently di kasir. Hasilnya, waktu checkout berkurang 40%." — Pemilik Kafe di Jakarta

## Bagaimana Memulai Transisi ke Pembayaran Digital?

**Langkah 1: Pilih Platform yang Tepat**
Cari platform yang menyediakan:
- Multiple payment options
- Integrasi mudah
- Fee transparan
- Support yang responsif

**Langkah 2: Edukasi Tim Anda**
- Training penggunaan sistem
- SOP untuk transaksi digital
- Troubleshooting dasar

**Langkah 3: Komunikasikan ke Pelanggan**
- Informasikan opsi pembayaran baru
- Tunjukkan kemudahan yang mereka dapat
- Berikan incentive untuk adopsi awal

**Langkah 4: Monitor dan Optimasi**
- Pantau metrik key (conversion, waktu bayar)
- Minta feedback pelanggan
- Iterasi berdasarkan data

## Kesimpulan

Pembayaran digital bukan sekadar trend—ini adalah fondasi bisnis modern. Dengan 7 manfaat di atas, tidak ada alasan untuk tetap bergantung pada metode manual.

**Mulai transformasi digital bisnis Anda hari ini.** Daftar gratis di PeyGo dan nikmati kemudahan menerima pembayaran dari berbagai metode dalam satu platform.
    `,
  },
  "kelola-arus-kas-bisnis": {
    title: "Panduan Lengkap Mengelola Arus Kas untuk Bisnis Kecil",
    excerpt: "Arus kas adalah nyawa bisnis. Simak panduan lengkap mengelola cash flow agar bisnis Anda tetap sehat.",
    image: "/blog/cashflow.jpg",
    author: "Tim PeyGo",
    date: "2024-12-10",
    readTime: "12 menit",
    category: "Keuangan",
    content: `
"Revenue is vanity, profit is sanity, but cash is king." — Pepatah bisnis klasik yang masih sangat relevan.

82% bisnis gagal bukan karena tidak profitable, tapi karena kehabisan cash. Masalah cash flow adalah silent killer yang sering tidak disadari sampai terlambat.

Dalam panduan lengkap ini, Anda akan mempelajari cara mengelola arus kas seperti seorang CFO profesional—meski bisnis Anda masih skala UMKM.

## Memahami Dasar-Dasar Cash Flow

Sebelum mengelola, mari pahami dulu apa itu cash flow.

**Definisi Sederhana:**
Cash flow adalah pergerakan uang masuk dan keluar dari bisnis Anda dalam periode tertentu.

**Tiga Jenis Cash Flow:**

1. **Operating Cash Flow** — Uang dari aktivitas bisnis utama
   - Contoh: Pembayaran dari pelanggan, pembayaran ke supplier

2. **Investing Cash Flow** — Uang untuk membeli/menjual aset
   - Contoh: Beli mesin baru, jual kendaraan lama

3. **Financing Cash Flow** — Uang dari/untuk pendanaan
   - Contoh: Pinjaman bank, setoran modal pemilik

**Rumus Dasar:**
> Cash Flow = Cash In - Cash Out

Jika positif, bisnis Anda sehat. Jika negatif, Anda perlu bertindak cepat.

## Langkah 1: Pahami Cash Flow Cycle Bisnis Anda

Setiap bisnis memiliki siklus cash yang berbeda. Memahami ini adalah langkah pertama.

**Contoh Cash Flow Cycle:**

*Bisnis Retail:*
- Beli stok (Cash Out) → Simpan di gudang (0-30 hari) → Jual (Cash In)
- Cycle: 30-45 hari

*Bisnis Jasa:*
- Kerja project (0-14 hari) → Kirim invoice → Tunggu bayar (14-30 hari) → Cash In
- Cycle: 14-45 hari

*Bisnis Manufaktur:*
- Beli bahan baku → Produksi (7-30 hari) → Simpan → Jual → Cash In
- Cycle: 45-90 hari

**Action Item:**
Gambar cash flow cycle bisnis Anda. Identifikasi:
- Berapa lama dari cash out sampai cash in?
- Di mana bottleneck terbesar?
- Apa yang bisa dipercepat?

## Langkah 2: Buat Cash Flow Forecast

Prediksi adalah kunci. Dengan forecast, Anda bisa antisipasi masalah sebelum terjadi.

**Template Cash Flow Forecast Sederhana:**

| Minggu | Saldo Awal | Cash In | Cash Out | Saldo Akhir |
|--------|-----------|---------|----------|-------------|
| 1      | 50jt      | 30jt    | 25jt     | 55jt        |
| 2      | 55jt      | 20jt    | 40jt     | 35jt        |
| 3      | 35jt      | 45jt    | 30jt     | 50jt        |
| 4      | 50jt      | 25jt    | 35jt     | 40jt        |

**Tips Membuat Forecast Akurat:**
- Gunakan data historis sebagai baseline
- Identifikasi seasonality (musiman)
- Sisakan buffer 10-20% untuk unexpected
- Update forecast setiap minggu

## Langkah 3: Percepat Cash Inflow

Semakin cepat uang masuk, semakin sehat bisnis Anda.

**Strategi Mempercepat Penerimaan:**

**A. Optimalkan Proses Invoicing**
- Kirim invoice segera setelah pekerjaan selesai
- Gunakan payment link untuk kemudahan bayar
- Set due date yang reasonable tapi tidak terlalu panjang
- Format net 7 atau net 14, bukan net 30

**B. Tawarkan Insentif Early Payment**
- Diskon 2-3% untuk pembayaran dalam 7 hari
- Contoh: "2/10 net 30" = diskon 2% jika bayar dalam 10 hari

**C. Diversifikasi Metode Pembayaran**
- QRIS untuk transaksi cepat
- Virtual Account untuk kemudahan
- E-wallet untuk generasi muda
- Kartu kredit/cicilan untuk transaksi besar

**D. Implementasi Sistem Pengingat**
- H-3 sebelum jatuh tempo
- Hari H jatuh tempo
- H+3 dan H+7 setelah jatuh tempo

**Case Study:**
Sebuah digital agency mengurangi Days Sales Outstanding (DSO) dari 45 hari menjadi 18 hari dengan menerapkan payment link + pengingat otomatis. Cash flow improvement: 150%.

## Langkah 4: Kelola Cash Outflow dengan Bijak

Bukan hanya tentang mengurangi pengeluaran, tapi mengoptimalkan timing.

**Strategi Mengelola Pengeluaran:**

**A. Negosiasi Payment Terms dengan Supplier**
- Minta terms yang lebih panjang (net 30 → net 45)
- Bangun hubungan baik untuk fleksibilitas
- Jangan korbankan kualitas demi terms

**B. Prioritaskan Pengeluaran**
- **Kritikal:** Gaji, operasional harian, supplier kunci
- **Penting:** Marketing, maintenance, upgrade
- **Bisa Ditunda:** Ekspansi, nice-to-have

**C. Review Subscription dan Fixed Cost**
- Audit semua subscription bulanan
- Cancel yang tidak digunakan
- Negosiasi harga yang lebih baik

**D. Timing Pembayaran yang Strategis**
- Bayar di hari terakhir terms, bukan lebih awal
- Manfaatkan grace period kartu kredit
- Batch pembayaran untuk efisiensi

## Langkah 5: Siapkan Cash Reserve

Buffer dana adalah perlindungan terhadap ketidakpastian.

**Berapa Banyak Reserve yang Ideal?**
- **Minimum:** 1 bulan biaya operasional
- **Recommended:** 3 bulan biaya operasional
- **Ideal:** 6 bulan biaya operasional

**Cara Membangun Reserve:**
1. Tentukan target jumlah reserve
2. Alokasikan 10-20% dari profit bulanan
3. Simpan di rekening terpisah
4. Jangan sentuh kecuali emergency

**Apa yang Termasuk Emergency:**
✅ Pelanggan besar telat bayar
✅ Kerusakan equipment kritis
✅ Situasi force majeure (pandemi, bencana)

**Bukan Emergency:**
❌ Opportunity bisnis baru
❌ Diskon dari supplier
❌ Keinginan ekspansi

## Langkah 6: Monitor Cash Flow Secara Rutin

Yang tidak diukur, tidak bisa dikelola.

**Metrik Cash Flow yang Harus Dipantau:**

1. **Days Sales Outstanding (DSO)**
   - Rata-rata waktu pelanggan membayar
   - Target: < 30 hari

2. **Days Payable Outstanding (DPO)**
   - Rata-rata waktu Anda membayar supplier
   - Target: Seimbang dengan terms

3. **Cash Conversion Cycle (CCC)**
   - DSO + Days Inventory - DPO
   - Target: Semakin kecil semakin baik

4. **Operating Cash Flow Ratio**
   - Operating Cash Flow / Current Liabilities
   - Target: > 1

**Jadwal Monitoring:**
- Harian: Cek saldo dan transaksi
- Mingguan: Review forecast vs actual
- Bulanan: Analisis trend dan metrik
- Kuartalan: Strategic review

## Tools untuk Mengelola Cash Flow

**Software Accounting:**
- Accurate Online
- Jurnal.id
- Zahir

**Invoicing & Payment:**
- PeyGo — Invoice dengan payment link dan dashboard analytics
- Xendit, Midtrans — Payment gateway

**Spreadsheet:**
- Google Sheets dengan template cash flow
- Excel dengan formula otomatis

## Red Flags Cash Flow yang Harus Diwaspadai

⚠️ Saldo bank menurun konsisten 3 bulan berturut-turut
⚠️ Sering meminjam untuk bayar operasional
⚠️ Aging receivable > 60 hari meningkat
⚠️ Tidak bisa ambil gaji/dividen pemilik
⚠️ Sering telat bayar supplier

**Jika Mengalami Red Flags:**
1. Audit segera semua receivables
2. Negosiasi ulang dengan supplier
3. Cut pengeluaran non-esensial
4. Pertimbangkan financing jangka pendek
5. Konsultasi dengan advisor keuangan

## Kesimpulan

Mengelola cash flow tidak harus rumit. Dengan memahami siklus bisnis, membuat forecast, mempercepat penerimaan, mengoptimalkan pengeluaran, dan monitoring rutin, Anda bisa menjaga kesehatan finansial bisnis.

**Key Takeaways:**
1. Cash flow ≠ Profit — Keduanya berbeda dan sama pentingnya
2. Forecast adalah navigation tool Anda
3. Percepat cash in, optimasi cash out
4. Siapkan buffer untuk ketidakpastian
5. Monitor metrik secara rutin

**Langkah Pertama Anda:**
Daftar gratis di PeyGo dan mulai percepat proses penerimaan pembayaran dengan invoice + payment link + pengingat otomatis. Setiap hari yang Anda hemat adalah improvement cash flow.
    `,
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = Object.entries(blogPosts)
    .filter(([key]) => key !== slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="group">
              <span className="text-3xl font-bold tracking-tighter">
                <span className="text-primary">Pey</span><span className="text-foreground">Go</span>
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/blog" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                Blog
              </Link>
              <Button asChild>
                <Link href="/daftar">Daftar Gratis</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Cover Image */}
        <div className="relative h-64 md:h-96 bg-muted">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        {/* Article */}
        <article className="py-12 md:py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            {/* Back link */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-8">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Blog
            </Link>

            {/* Category */}
            <div className="mb-6">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 tracking-tighter leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-12 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} baca</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
              {post.content.split("\n").map((line, i) => {
                const trimmedLine = line.trim();
                
                // Helper function to parse inline markdown (bold)
                const parseInline = (text: string) => {
                  const parts = text.split(/(\*\*[^*]+\*\*)/g);
                  return parts.map((part, idx) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={idx} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  });
                };
                
                if (trimmedLine.startsWith("## ")) {
                  return <h2 key={i} className="text-2xl font-semibold mt-12 mb-4 text-foreground">{trimmedLine.replace("## ", "")}</h2>;
                }
                if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("✅") || trimmedLine.startsWith("❌") || trimmedLine.startsWith("⚠️")) {
                  const content = trimmedLine.replace(/^- /, "");
                  return <li key={i} className="ml-6 mb-1">{parseInline(content)}</li>;
                }
                if (trimmedLine.startsWith("> ")) {
                  return <blockquote key={i} className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">{parseInline(trimmedLine.replace("> ", ""))}</blockquote>;
                }
                if (/^\d+\.\s/.test(trimmedLine)) {
                  const content = trimmedLine.replace(/^\d+\.\s/, "");
                  return <li key={i} className="ml-6 mb-1 list-decimal">{parseInline(content)}</li>;
                }
                if (trimmedLine.startsWith("|")) {
                  return null;
                }
                if (trimmedLine.startsWith("*") && trimmedLine.endsWith("*") && !trimmedLine.startsWith("**")) {
                  return <p key={i} className="italic text-muted-foreground">{trimmedLine.replace(/^\*|\*$/g, "")}</p>;
                }
                if (trimmedLine) {
                  return <p key={i} className="mb-4 leading-relaxed">{parseInline(trimmedLine)}</p>;
                }
                return null;
              })}
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Bagikan artikel ini:</span>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="text-2xl font-semibold text-foreground mb-8 tracking-tighter">Artikel Lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map(([relatedSlug, relatedPost]) => (
                  <Link key={relatedSlug} href={`/blog/${relatedSlug}`}>
                    <Card className="h-full hover:-translate-y-1 transition-transform group">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <span className="text-xs font-medium text-primary uppercase tracking-wide">{relatedPost.category}</span>
                        <h3 className="font-semibold text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                          <span>Baca selengkapnya</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-foreground">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-background mb-4 tracking-tighter">
              Mulai Kelola Invoice Anda dengan PeyGo
            </h2>
            <p className="text-background/60 mb-8">
              Buat invoice profesional dan terima pembayaran dengan mudah. Gratis untuk memulai.
            </p>
            <Button asChild size="lg">
              <Link href="/daftar">Daftar Gratis Sekarang</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} PeyGo. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
