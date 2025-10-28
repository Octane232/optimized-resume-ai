
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import BenefitsSection from '@/components/BenefitsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import ComingSoonSection from '@/components/ComingSoonSection';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';
import ResumesShowcase from '@/components/ResumesShowcase';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <div id="features">
        <HowItWorksSection />
      </div>
      <div id="templates">
        <ResumesShowcase />
      </div>
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
