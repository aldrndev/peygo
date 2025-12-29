import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-foreground border-0 overflow-hidden relative rounded-3xl shadow-2xl">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute -bottom-[20%] -left-[20%] w-[80%] h-[80%] bg-blue-500/20 rounded-full blur-[120px]" />
            </div>
            
            <CardContent className="p-10 md:p-16 relative z-10 text-background">
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tighter text-center">
                Siap Memulai <br/> Masa Depan?
              </h2>
              <p className="opacity-60 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto text-center">
                Bergabung dengan ribuan bisnis yang telah mengefisiensi arus kas mereka dengan PeyGo. <span className="opacity-100 font-semibold">Daftar sekarang, gratis.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button asChild size="lg">
                  <Link href="/daftar">
                    Daftar Sekarang
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="border border-white/30 !bg-transparent text-white hover:!bg-white" asChild>
                  <Link href="https://wa.me/628123456789">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Tanya Ahli Kami
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
