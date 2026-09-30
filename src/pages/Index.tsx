import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ComparisonSection from '@/components/ComparisonSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // If Supabase sends the OAuth callback to the site root, forward the
  // signed-in user straight to the dashboard instead of stranding them here.
  useEffect(() => {
    const url = new URL(window.location.href);
    const isOAuthReturn =
      url.searchParams.has('code') || url.hash.includes('access_token');
    if (!isOAuthReturn) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        window.history.replaceState({}, '', '/');
        navigate('/dashboard', { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.history.replaceState({}, '', '/');
        navigate('/dashboard', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


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
    <div className="warm font-body min-h-screen bg-background text-foreground">
      <SEOHead
        title="Vaylance — AI Job Search Platform | Get Hired Faster"
        description="Vaylance helps you tailor your resume to pass ATS filters, prep for interviews, and find companies hiring before they post publicly. Start free."
        keywords="ATS resume scanner, resume checker, interview prep AI, job search tool, cover letter generator, salary intelligence"
        canonical="https://vaylance.com/"
      />
      <Header />
      <HeroSection />
      <div id="features"><FeaturesSection /></div>
      <ComparisonSection />
      <div id="testimonials"><TestimonialsSection /></div>
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
