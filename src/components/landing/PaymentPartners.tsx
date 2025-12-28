"use client";

import Image from "next/image";

const paymentPartners = [
  { name: "QRIS", logo: "/logos/payments/qris.png" },
  { name: "Visa", logo: "/logos/payments/visa.png" },
  { name: "Mastercard", logo: "/logos/payments/mastercard.png" },
  { name: "JCB", logo: "/logos/payments/jcb.png" },
  { name: "BCA", logo: "/logos/payments/bca.png" },
  { name: "Mandiri", logo: "/logos/payments/mandiri.png" },
  { name: "BNI", logo: "/logos/payments/bni.png" },
  { name: "BRI", logo: "/logos/payments/bri.png" },
  { name: "GoPay", logo: "/logos/payments/gopay.png" },
  { name: "OVO", logo: "/logos/payments/ovo.png" },
  { name: "Dana", logo: "/logos/payments/dana.png" },
];

export default function PaymentPartners() {
  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Metode Pembayaran
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
            Didukung Berbagai Bank & E-Wallet Terpercaya
          </h3>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-xl">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {paymentPartners.map((partner) => (
              <div
                key={partner.name}
                className="relative h-10 md:h-12 w-20 md:w-28 hover:scale-110 hover:opacity-80 transition-all duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 80px, 112px"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wide mt-6">
          Dan masih banyak lagi metode pembayaran lainnya
        </p>
      </div>
    </section>
  );
}
