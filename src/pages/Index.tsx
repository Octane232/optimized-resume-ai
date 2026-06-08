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

// DashboardMockup component with the correct logo
const DashboardMockup = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 rounded-xl shadow-2xl border border-border/50 overflow-hidden">
      {/* Mockup Header */}
      <div className="bg-[#0f0f12] px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Fixed: Replaced gradient box with SVG logo */}
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="11" fill="#1d4ed8"/>
            <circle cx="22" cy="27" r="11" stroke="white" strokeWidth="2.2" fill="none"/>
            <circle cx="22" cy="27" r="6.5" stroke="white" strokeWidth="1.6" strokeOpacity="0.6" fill="none"/>
            <circle cx="22" cy="27" r="2.6" fill="white"/>
            <line x1="29.5" y1="19.5" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
            <line x1="32.5" y1="13" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
            <line x1="36" y1="13" x2="36" y2="16.5" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Vaylance</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
      
      {/* Mockup Sidebar + Content */}
      <div className="flex min-h-[500px] bg-[#0a0a0c]">
        {/* Sidebar */}
        <div className="w-48 border-r border-border/50 p-3 space-y-4">
          <div className="space-y-1">
            <div className="h-8 bg-muted/20 rounded-lg w-full" />
            <div className="h-8 bg-muted/10 rounded-lg w-full" />
            <div className="h-8 bg-muted/10 rounded-lg w-full" />
          </div>
          <div className="pt-4 border-t border-border/50">
            <div className="h-8 bg-primary/20 rounded-lg w-full" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="space-y-3">
            <div className="h-8 bg-muted/20 rounded-lg w-1/3" />
            <div className="h-32 bg-muted/10 rounded-lg w-full" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-24 bg-muted/10 rounded-lg" />
              <div className="h-24 bg-muted/10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
