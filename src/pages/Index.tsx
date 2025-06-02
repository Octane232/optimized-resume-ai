
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import BenefitsSection from '@/components/BenefitsSection';
import ResumesShowcase from '@/components/ResumesShowcase';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import ComingSoonSection from '@/components/ComingSoonSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ResumesShowcase />
      <TestimonialsSection />
      <PricingSection />
      <ComingSoonSection />
      <Footer />
    </div>
  );
};

export default Index;
