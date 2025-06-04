
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Briefcase, TrendingUp } from 'lucide-react';

const ForIndividuals = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                For Individuals
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Take control of your career with our comprehensive suite of tools designed for individual job seekers.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Get Started Today
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <User className="w-8 h-8" />,
                  title: "Personal Branding",
                  description: "Build a compelling professional profile that stands out to recruiters"
                },
                {
                  icon: <Briefcase className="w-8 h-8" />,
                  title: "Job Matching",
                  description: "Get matched with opportunities that align with your skills and goals"
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Career Growth",
                  description: "Track your progress and accelerate your professional development"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center p-8">
                  <CardContent className="p-0">
                    <div className="text-blue-600 mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForIndividuals;
