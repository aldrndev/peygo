"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Ahmad Fauzi",
    role: "Business Owner",
    content: "PeyGo sangat membantu bisnis kami. Proses invoice jadi lebih cepat dan profesional. Pelanggan juga lebih mudah melakukan pembayaran.",
    avatar: "AF"
  },
  {
    name: "Sri Wahyuni",
    role: "Finance Manager",
    content: "Dengan PeyGo, rekonsiliasi pembayaran jadi otomatis. Tim finance kami bisa fokus ke hal yang lebih strategis.",
    avatar: "SW"
  },
  {
    name: "Budi Santoso",
    role: "Freelance Designer",
    content: "Platform yang sangat user-friendly! Saya bisa kirim invoice ke klien dalam hitungan detik dan terima pembayaran lebih cepat.",
    avatar: "BS"
  },
  {
    name: "Maya Putri",
    role: "CEO Startup",
    content: "Metode pembayaran yang lengkap. Pelanggan bisa bayar pakai QRIS, transfer bank, atau e-wallet. Sangat fleksibel!",
    avatar: "MP"
  }
];

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimoni" className="py-24 md:py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
            <span>Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
            Dipercaya Ribuan Bisnis
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            Bergabunglah dengan komunitas pengusaha sukses di PeyGo.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="bg-foreground text-background border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-10 md:p-16 relative">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

              <div className="flex justify-center mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-primary fill-primary mx-1" />
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-12">
                  &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl uppercase tracking-tight">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="opacity-60 text-xs font-medium uppercase tracking-wide mt-1">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-16" role="tablist" aria-label="Testimonial navigation">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    role="tab"
                    aria-selected={index === currentTestimonial}
                    aria-label={`Go to testimonial from ${testimonial.name}`}
                    type="button"
                    className={cn(
                      "min-w-11 min-h-11 flex items-center justify-center transition-all duration-200 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground",
                    )}
                  >
                    <span className={cn(
                      "rounded-full transition-all duration-200",
                      index === currentTestimonial 
                        ? "bg-primary w-8 h-2" 
                        : "bg-background/30 w-2 h-2 hover:bg-background/50"
                    )} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
