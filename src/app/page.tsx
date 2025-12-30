"use client";

import dynamic from "next/dynamic";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection, faqs } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

// Lazy load below-the-fold components for better LCP
const TrustBadges = dynamic(() => import("@/components/landing/TrustBadges"));
const ComparisonTable = dynamic(() => import("@/components/landing/ComparisonTable"));
const PaymentPartners = dynamic(() => import("@/components/landing/PaymentPartners"));
const TargetAudience = dynamic(() => import("@/components/landing/TargetAudience"));
const WhatsAppFloatingButton = dynamic(
  () => import("@/components/ui/WhatsAppFloatingButton"),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <>
      <JsonLd faqs={faqs} />
      <div className="min-h-screen bg-background overflow-x-hidden relative">
        {/* Aurora Background Elements - Optimized for Mobile */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transform-gpu">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[60px] md:blur-[120px] opacity-50 md:opacity-100 will-change-transform" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/10 blur-[60px] md:blur-[120px] opacity-40 md:opacity-100 will-change-transform" />
          <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-success/10 blur-[60px] md:blur-[120px] opacity-40 md:opacity-100 will-change-transform" />
        </div>

        <LandingHeader />
        <main id="main-content">
          <HeroSection />
          <PaymentPartners />
          <StatsSection />
          <TrustBadges />
          <FeaturesSection />
          <ComparisonTable />
          <TargetAudience />
          <HowItWorksSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
        </main>
        <LandingFooter />
        
        <WhatsAppFloatingButton />
      </div>
    </>
  );
}
