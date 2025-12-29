"use client";

import { useState, useEffect } from "react";

interface StatsCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isVisible: boolean;
}

function StatsCounter({ end, suffix = "", prefix = "", label, isVisible }: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isVisible && !hasStarted) {
      setHasStarted(true);
    }
  }, [isVisible, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime: number;
    let rafId: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / 2000, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(rafId);
  }, [end, hasStarted]);

  return (
    <div className="text-center md:border-r border-border last:border-0">
      <div className="text-5xl md:text-7xl font-bold text-foreground mb-3 tracking-tighter tabular-nums">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
    </div>
  );
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    const statsSection = document.getElementById('stats-section');
    if (statsSection) observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-card/80 backdrop-blur-xl border border-border p-12 rounded-3xl shadow-2xl">
          <StatsCounter end={8500} suffix="+" label="Invoice Terkirim" isVisible={isVisible} />
          <div className="text-center md:border-r border-border">
            <div className="text-5xl md:text-7xl font-bold text-primary mb-3 tracking-tighter tabular-nums">
              Rp {isVisible ? "25" : "0"}M+
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Transaksi</p>
          </div>
          <StatsCounter end={1200} suffix="+" label="Pengguna Aktif" isVisible={isVisible} />
        </div>
      </div>
    </section>
  );
}
