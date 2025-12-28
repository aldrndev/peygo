"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

interface ClientQRCodeProps {
  invoiceId: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
}

export default function ClientQRCode({ invoiceId, size = 120, level = "H" }: ClientQRCodeProps) {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    setPaymentUrl(`${window.location.origin}/pay/${invoiceId}`);
  }, [invoiceId]);

  if (!paymentUrl) {
    return (
      <div 
        className="animate-pulse bg-muted rounded"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <QRCode 
      value={paymentUrl}
      size={size}
      level={level}
    />
  );
}
