import { FileText, CreditCard, Zap, BarChart3, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Invoice Premium",
    description: "Buat invoice dengan tampilan profesional lengkap dengan logo dan kustomisasi branding.",
    color: "primary" as const,
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Global Gateway",
    description: "Terima pembayaran via QRIS, VA Bank, E-Wallet, dan Kartu Kredit secara real-time.",
    color: "secondary" as const,
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Kilat Settlement",
    description: "Dana masuk ke rekening Anda dalam hitungan jam. Tanpa ribet, tanpa pending lama.",
    color: "warning" as const,
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Analytics Canggih",
    description: "Pantau performa bisnis dengan dashboard finansial yang informatif dan tepat sasaran.",
    color: "success" as const,
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Enterprise Security",
    description: "Sistem berlapis dengan enkripsi 256-bit dan diawasi oleh regulator resmi Indonesia.",
    color: "danger" as const,
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Smart Automation",
    description: "Pengingat tagihan otomatis untuk pelanggan, memastikan arus kas Anda selalu terjaga.",
    color: "primary" as const,
  },
];

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-blue-500/10 text-blue-500",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

export function FeaturesSection() {
  return (
    <section id="fitur" className="py-24 md:py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
            <span>Powerful Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
            Didesain untuk Skala Bisnis Anda
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
            Platform lengkap untuk mengelola invoice dan pembayaran bisnis Anda dengan standar keamanan internasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="h-full hover:-translate-y-2 transition-transform duration-300 group">
              <CardContent className="p-10">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500", colorClasses[feature.color])}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
