export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
            <span>Alur Kerja Mudah</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
            Mulai dalam Hitungan Detik
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg font-medium">
            Proses yang sangat simpel untuk hasil bisnis yang maksimal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-border" />
          
          <StepCard step="1" title="Daftar" description="Buat akun dalam 30 detik tanpa verifikasi rumit." />
          <StepCard step="2" title="Tagih" description="Masukkan detail transaksi dan kirim ke pelanggan." />
          <StepCard step="3" title="Terima" description="Dana langsung masuk ke rekening Anda otomatis." />
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="text-center relative group">
      <div className="w-20 h-20 bg-card border border-border rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:bg-foreground transition-all duration-300">
        <span className="text-3xl font-bold text-foreground group-hover:text-background transition-colors tracking-tighter">{step}</span>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground font-medium max-w-[200px] mx-auto leading-relaxed">{description}</p>
    </div>
  );
}
