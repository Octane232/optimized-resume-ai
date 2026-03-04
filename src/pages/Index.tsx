import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import TrustedBySection from '@/components/TrustedBySection';
import HowItWorksSection from '@/components/HowItWorksSection';
import ProductShowcase from '@/components/ProductShowcase';
import BenefitsSection from '@/components/BenefitsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import TrustBadges from '@/components/TrustBadges';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

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
      <SEOHead
        title="Vaylance – AI Resume Builder & Career Coach | Get Hired Faster"
        description="Vaylance is the AI career platform that writes ATS-optimized resumes, matches you to jobs, and coaches you through interviews. Start free today."
        keywords="AI resume builder, ATS resume checker, career coach AI, job search tool, resume templates, interview prep, cover letter generator"
        canonical="https://vaylance.com/"
      />
      <Header />
      <HeroSection />
      <StatsSection />
      <TrustedBySection />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="features">
        <ProductShowcase />
      </div>
      <BenefitsSection />
      <TestimonialsSection />
      <TrustBadges />
      <PricingSection />
      <FAQSection />
      <div id="resources">
        <ResourcesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
