import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    question: "Apakah PeyGo gratis digunakan?",
    answer: "Ya! PeyGo gratis untuk membuat dan mengirim invoice. Kami hanya mengenakan biaya transaksi yang sangat kompetitif saat pelanggan Anda melakukan pembayaran."
  },
  {
    question: "Metode pembayaran apa saja yang didukung?",
    answer: "PeyGo mendukung berbagai metode pembayaran populer di Indonesia: Virtual Account (BCA, Mandiri, BNI, BRI), QRIS, E-Wallet (GoPay, OVO, Dana), dan Kartu Kredit/Debit."
  },
  {
    question: "Berapa lama dana masuk ke rekening saya?",
    answer: "Dana akan masuk ke rekening Anda dalam 1x24 jam setelah pembayaran dikonfirmasi. Proses settlement dilakukan otomatis setiap hari kerja."
  },
  {
    question: "Apakah data saya aman?",
    answer: "Keamanan adalah prioritas kami. PeyGo menggunakan enkripsi SSL 256-bit dan bekerjasama dengan mitra pembayaran berizin yang diawasi OJK dan Bank Indonesia."
  },
  {
    question: "Bagaimana cara memulai?",
    answer: "Sangat mudah! Cukup daftar gratis, lengkapi profil bisnis Anda, dan mulai buat invoice pertama Anda. Tidak perlu verifikasi dokumen yang rumit untuk memulai."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
            <span>Support</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
            Pertanyaan Umum
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            Semua yang perlu Anda ketahui tentang PeyGo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
