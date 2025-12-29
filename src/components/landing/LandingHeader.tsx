"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LandingHeaderProps {
  className?: string;
}

export function LandingHeader({ className }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mobileMenuOpen]);

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
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="group">
            <span className="text-3xl font-bold tracking-tighter">
              <span className="text-primary">Pey</span><span className="text-foreground">Go</span>
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

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden overflow-hidden bg-card/90 backdrop-blur-xl border-t border-border shadow-2xl mt-4 rounded-2xl"
          >
            <div className="py-6 px-6 flex flex-col gap-4">
              <Link href="#fitur" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                Fitur
              </Link>
              <Link href="#testimoni" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                Testimoni
              </Link>
              <Link href="#faq" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
              <Link href="/blog" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <div className="h-px bg-border" />
              <Link href="/masuk" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                Masuk
              </Link>
              <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/daftar">Daftar Gratis</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
