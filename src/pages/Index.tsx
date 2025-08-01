
import React from 'react';
import Header from '@/components/Header';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import BenefitsSection from '@/components/BenefitsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import ComingSoonSection from '@/components/ComingSoonSection';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <EnhancedHeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <ComingSoonSection />
      <div id="resources">
        <ResourcesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
