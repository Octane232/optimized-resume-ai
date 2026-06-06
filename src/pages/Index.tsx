import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustedBySection from '@/components/TrustedBySection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (location.hash) {
      try {
        const id = location.hash.substring(1).replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&');
        const el = document.getElementById(id);
        if (el) {
          timeoutRef.current = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      } catch (error) {
        console.error('Error scrolling to element:', error);
      }
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [location]);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SEOHead
        title="Vaylance — AI Job Search Platform | Get Hired Faster"
        description="Vaylance helps you tailor your resume to pass ATS filters, prep for interviews, and find companies hiring before they post publicly. Start free."
        keywords="AI resume builder, ATS resume checker, interview prep AI, job search tool, cover letter generator, salary intelligence"
        canonical="https://vaylance.com/"
      />
      <Header />
      <HeroSection />
      <TrustedBySection />
      <div id="features"><FeaturesSection /></div>
      <HowItWorksSection />
      <div id="testimonials"><TestimonialsSection /></div>
      <div id="pricing"><PricingSection /></div>
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
