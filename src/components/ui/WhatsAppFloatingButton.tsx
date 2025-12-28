"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

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
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
      {/* Tooltip */}
      <div 
        className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-card shadow-lg rounded-xl px-4 py-2 whitespace-nowrap border border-border transition-all duration-200 ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <p className="text-xs font-semibold text-foreground">
          Chat dengan Kami
        </p>
      </div>

      {/* Button */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:scale-105 transition-all border-2 border-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat via WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" fill="white" aria-hidden="true" />
      </Link>
    </div>
  );
}
