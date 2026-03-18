import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  const location = useLocation();
  const timeoutRef = useRef();

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (location.hash) {
      try {
        // Remove the # and escape special characters
        const id = location.hash.substring(1).replace(/[!\"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&');
        const el = document.getElementById(id);
        
        if (el) {
          timeoutRef.current = setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } catch (error) {
        console.error('Error scrolling to element:', error);
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Vaylance — AI Job Search Platform | Get Hired Faster"
        description="Vaylance helps you tailor your resume to pass ATS filters, prep for interviews, and find companies hiring before they post publicly. Start free for 14 days."
        keywords="AI resume builder, ATS resume checker, interview prep AI, job search tool, cover letter generator, salary intelligence"
        canonical="https://vaylance.com/"
      />
      <Header />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
