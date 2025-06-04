
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
      <div id="templates">
        <ResumesShowcase />
      </div>
      <TestimonialsSection />
      <PricingSection />
      <ComingSoonSection />
      <div id="resources">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Resources Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building comprehensive resources including help center, career blog, 
              resume examples, interview tips, and API documentation.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
