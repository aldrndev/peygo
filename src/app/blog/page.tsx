import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Static blog posts data
const blogPosts = [
  {
    slug: "cara-membuat-invoice-profesional",
    title: "5 Tips Membuat Invoice Profesional untuk UMKM",
    excerpt: "Pelajari cara membuat invoice yang terlihat profesional dan meningkatkan kredibilitas bisnis Anda di mata pelanggan.",
    author: "Tim PeyGo",
    date: "2024-12-20",
    readTime: "8 menit",
    image: "/blog/invoice-tips.jpg",
    category: "Tips Bisnis",
  },
  {
    slug: "manfaat-pembayaran-digital-umkm",
    title: "7 Alasan Mengapa UMKM Harus Beralih ke Pembayaran Digital",
    excerpt: "Era digital menghadirkan banyak kemudahan. Temukan alasan mengapa pembayaran digital penting untuk pertumbuhan bisnis Anda.",
    author: "Tim PeyGo",
    date: "2024-12-15",
    readTime: "10 menit",
    image: "/blog/digital-payment.jpg",
    category: "Edukasi",
  },
  {
    slug: "kelola-arus-kas-bisnis",
    title: "Panduan Lengkap Mengelola Arus Kas untuk Bisnis Kecil",
    excerpt: "Arus kas adalah nyawa bisnis. Simak panduan lengkap mengelola cash flow agar bisnis Anda tetap sehat.",
    author: "Tim PeyGo",
    date: "2024-12-10",
    readTime: "12 menit",
    image: "/blog/cashflow.jpg",
    category: "Keuangan",
  },
];

export const metadata = {
  title: "Blog - Tips & Panduan Bisnis",
  description: "Artikel, tips, dan panduan seputar invoice, pembayaran digital, dan pengelolaan keuangan untuk UMKM Indonesia.",
};

export default function BlogPage() {
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
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                Beranda
              </Link>
              <Button asChild>
                <Link href="/daftar">Daftar Gratis</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
                <span>Blog PeyGo</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
                Tips & Panduan Bisnis
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Artikel terbaru seputar invoice, pembayaran digital, dan pengelolaan keuangan untuk membantu bisnis Anda berkembang.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <Link href={`/blog/${blogPosts[0].slug}`} className="block">
              <Card className="overflow-hidden group">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto relative overflow-hidden">
                    <Image
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                  <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide mb-4">
                      {blogPosts[0].category} • Artikel Terbaru
                    </span>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 tracking-tighter group-hover:text-primary transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-muted-foreground mb-6 line-clamp-2">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(blogPosts[0].date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{blogPosts[0].readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold text-foreground mb-8 tracking-tighter">Semua Artikel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:-translate-y-2 transition-transform duration-300 group overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={false}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 tracking-tighter">
                Dapatkan Tips Bisnis Terbaru
              </h2>
              <p className="text-muted-foreground mb-8">
                Subscribe untuk mendapatkan artikel terbaru langsung di inbox Anda. Gratis!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-background mb-4 tracking-tighter">
              Siap Memulai dengan PeyGo?
            </h2>
            <p className="text-background/60 mb-8 max-w-lg mx-auto">
              Buat invoice profesional dan terima pembayaran dengan mudah.
            </p>
            <Button asChild size="lg">
              <Link href="/daftar">
                Daftar Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
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
