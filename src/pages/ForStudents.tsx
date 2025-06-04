
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

const ForStudents = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-br from-green-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <GraduationCap className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                For Students
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Launch your career with confidence. Get student-friendly resume templates and entry-level job opportunities.
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4">
                Start Your Career Journey
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForStudents;
