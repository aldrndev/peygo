"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSetting } from "@/contexts/SettingsContext";

interface LandingHeaderProps {
  className?: string;
}

export function LandingHeader({ className }: LandingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const platformName = useSetting("platform_name");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-lg" 
          : "bg-transparent border-transparent py-2",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group shrink-0">
            <span className="text-2xl sm:text-3xl font-bold tracking-tighter">
              <span className="text-primary">{platformName.slice(0, 3)}</span>
              <span className="text-foreground">{platformName.slice(3)}</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#fitur" className="text-muted-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
              Fitur
            </Link>
            <Link href="#testimoni" className="text-muted-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
              Testimoni
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
              FAQ
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
              Blog
            </Link>
            <div className="h-6 w-px bg-border mx-2" />
            <Link href="/masuk" className="text-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
              Masuk
            </Link>
            <Button asChild>
              <Link href="/daftar">Daftar Gratis</Link>
            </Button>
          </div>

          {/* Mobile Nav - Simplified (no hamburger) */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-xs px-3">
              <Link href="/masuk">Masuk</Link>
            </Button>
            <Button size="sm" asChild className="text-xs px-3">
              <Link href="/daftar">Daftar</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

