import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import ResumesShowcase from '@/components/ResumesShowcase';

const Templates = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Free Resume Templates – Professional & ATS-Friendly | Vaylance"
        description="Browse Vaylance's collection of free, professional resume templates. ATS-optimized designs for every industry – modern, classic, creative, and executive styles."
        keywords="free resume templates, ATS-friendly resume templates, professional resume design, modern resume template, creative resume layout"
        canonical="https://vaylance.com/templates"
      />
      <Header />
      <main className="pt-24">
        <ResumesShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Templates;
