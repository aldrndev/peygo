"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
            Metode Pembayaran
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
            Didukung Berbagai Bank & E-Wallet Terpercaya
          </h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-xl shadow-slate-200/30"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {paymentPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="relative h-10 md:h-12 w-20 md:w-28 hover:opacity-80 transition-all duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 80px, 112px"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-6"
        >
          Dan masih banyak lagi metode pembayaran lainnya
        </motion.p>
      </div>
    </section>
  );
}
