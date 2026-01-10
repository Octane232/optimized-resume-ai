
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import CyberHeroSection from '@/components/landing/CyberHeroSection';
import LiveFeedSection from '@/components/landing/LiveFeedSection';
import EngineSection from '@/components/landing/EngineSection';
import TrustSection from '@/components/landing/TrustSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen bg-charcoal">
      <Header />
      <CyberHeroSection />
      <LiveFeedSection />
      <EngineSection />
      <TrustSection />
      <div id="pricing">
        <PricingSection />
      </div>
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
