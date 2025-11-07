
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResumesShowcase from '@/components/ResumesShowcase';

const Templates = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <ResumesShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Templates;
