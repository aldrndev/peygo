"use client";

import { Button } from "@heroui/react";
import { MessageCircle } from "lucide-react";
import { motion /* AnimatePresence */ } from "framer-motion";
import { useState } from "react";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppFloatingButton({ 
  phoneNumber = "6281234567890",
  message = "Halo, saya tertarik dengan PeyGo!"
}: WhatsAppFloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
    >
      {/* Tooltip */}
      <motion.div
        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-2xl px-4 py-2 whitespace-nowrap"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Chat dengan Kami
        </p>
      </motion.div>

      {/* Button */}
      <Button
        as="a"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        isIconOnly
        className="w-16 h-16 rounded-full bg-[#25D366] shadow-2xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 hover:scale-110 transition-all border-2 border-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MessageCircle className="w-7 h-7 text-white" fill="white" />
      </Button>

      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]/30"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
