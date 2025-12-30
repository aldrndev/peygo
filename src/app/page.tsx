import dynamicImport from "next/dynamic";
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
import WhatsAppFloatingButton from "@/components/ui/WhatsAppFloatingButton";

// Force static generation for fastest TTFB
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

// Lazy load below-the-fold components for better LCP
const TrustBadges = dynamicImport(() => import("@/components/landing/TrustBadges"));
const ComparisonTable = dynamicImport(() => import("@/components/landing/ComparisonTable"));
const PaymentPartners = dynamicImport(() => import("@/components/landing/PaymentPartners"));
const TargetAudience = dynamicImport(() => import("@/components/landing/TargetAudience"));

export default function LandingPage() {
  return (
    <>
      <JsonLd faqs={faqs} />
      <div className="min-h-screen bg-background overflow-x-hidden relative">
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
