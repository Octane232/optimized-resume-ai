
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                About AI Resume Pro
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're revolutionizing the job search experience with AI-powered tools that help professionals 
                build better resumes, find perfect jobs, and accelerate their careers.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Join Our Mission
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                <p className="text-gray-600">Happy Users</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">500K+</div>
                <p className="text-gray-600">Resumes Created</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
                <p className="text-gray-600">Job Applications</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
